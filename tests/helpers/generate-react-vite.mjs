import {
  chmodSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const skillRoot = resolve(repositoryRoot, 'skills/bootstrap-web-project')
const assetsRoot = resolve(skillRoot, 'assets')
const placeholderPattern = /\{\{([A-Z0-9_]+)\}\}/g

export function readVersions() {
  return JSON.parse(readFileSync(resolve(assetsRoot, 'tooling/versions.json'), 'utf8'))
}

function substitute(text, values, sourcePath) {
  return text.replace(placeholderPattern, (_match, name) => {
    if (!(name in values)) {
      throw new Error(`unresolved placeholder {{${name}}} in ${sourcePath}`)
    }
    return values[name]
  })
}

function copyTemplateTree(sourceDirectory, targetDirectory, values) {
  for (const entry of readdirSync(sourceDirectory, { withFileTypes: true })) {
    const sourcePath = join(sourceDirectory, entry.name)
    const targetPath = join(targetDirectory, entry.name)

    if (entry.isDirectory()) {
      mkdirSync(targetPath, { recursive: true })
      copyTemplateTree(sourcePath, targetPath, values)
      continue
    }

    mkdirSync(dirname(targetPath), { recursive: true })
    writeFileSync(
      targetPath,
      substitute(readFileSync(sourcePath, 'utf8'), values, relative(assetsRoot, sourcePath)),
    )
    chmodSync(targetPath, statSync(sourcePath).mode)
  }
}

function sortedEntries(record) {
  return Object.fromEntries(
    Object.entries(record).sort(([left], [right]) => left.localeCompare(right)),
  )
}

/**
 * Materializes the React + Vite profile exactly as the skill documents it:
 * common assets, shared tooling copied into `.config/`, Git hooks, the stack
 * template and a manifest merged from `versions.json`.
 */
export function generateReactViteProject({
  targetDirectory,
  projectName,
  htmlLang = 'en',
  securityLevel = 'R1',
  securityRationale = 'Public demonstration content without authentication or personal data.',
}) {
  const versions = readVersions()
  const foundationVersion = JSON.parse(
    readFileSync(resolve(repositoryRoot, 'package.json'), 'utf8'),
  ).version
  const values = {
    ACCESSIBILITY_INVARIANTS:
      '- Meet WCAG 2.2 AA for every user-visible page, state and viewport.',
    ACCESSIBILITY_TARGET: 'WCAG 2.2 AA',
    CI_PROFILE: 'none',
    FOUNDATION_VERSION: foundationVersion,
    HTML_LANG: htmlLang,
    NODE_ENGINES: `>=${versions.runtime.nodeMajor}.0.0 <${versions.runtime.nodeMajor + 1}`,
    PROFILES: 'react-vite',
    PROFILES_YAML: '["react-vite"]',
    PROJECT_NAME: projectName,
    SECURITY_LEVEL: securityLevel,
    SECURITY_RATIONALE: securityRationale,
    YARN_VERSION: versions.runtime.yarn,
  }

  rmSync(targetDirectory, { force: true, recursive: true })
  mkdirSync(targetDirectory, { recursive: true })

  copyTemplateTree(resolve(assetsRoot, 'common'), targetDirectory, values)
  copyTemplateTree(
    resolve(assetsRoot, 'tooling/eslint'),
    resolve(targetDirectory, '.config/eslint'),
    values,
  )
  copyTemplateTree(
    resolve(assetsRoot, 'tooling/typescript'),
    resolve(targetDirectory, '.config/typescript'),
    values,
  )
  copyTemplateTree(resolve(assetsRoot, 'tooling/git'), targetDirectory, values)
  copyTemplateTree(resolve(assetsRoot, 'stacks/react-vite'), targetDirectory, values)

  const manifestPath = resolve(targetDirectory, 'package.json')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  manifest.dependencies = sortedEntries(versions.reactDependencies)
  manifest.devDependencies = sortedEntries({
    ...versions.commonDevDependencies,
    ...versions.nodeDevDependencies,
    ...versions.reactDevDependencies,
    ...versions.reactViteDevDependencies,
  })
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

  return { targetDirectory, values, versions }
}
