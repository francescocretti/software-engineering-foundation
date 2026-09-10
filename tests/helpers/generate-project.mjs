import {
  chmodSync,
  existsSync,
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
const assetsRoot = resolve(repositoryRoot, 'skills/bootstrap-web-project/assets')
const placeholderPattern = /\{\{([A-Z0-9_]+)\}\}/g
const appendableFiles = new Set(['.gitignore', '.env.example'])

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

function sortedEntries(record) {
  return Object.fromEntries(
    Object.entries(record).sort(([left], [right]) => left.localeCompare(right)),
  )
}

function mergeManifests(existing, incoming) {
  return {
    ...existing,
    ...incoming,
    scripts: { ...existing.scripts, ...incoming.scripts },
    dependencies: { ...existing.dependencies, ...incoming.dependencies },
    devDependencies: { ...existing.devDependencies, ...incoming.devDependencies },
  }
}

function writeTemplateFile(sourcePath, targetPath, values) {
  const content = substitute(readFileSync(sourcePath, 'utf8'), values, relative(assetsRoot, sourcePath))
  const fileName = targetPath.slice(targetPath.lastIndexOf('/') + 1)

  mkdirSync(dirname(targetPath), { recursive: true })

  if (existsSync(targetPath)) {
    if (fileName === 'package.json') {
      const merged = mergeManifests(
        JSON.parse(readFileSync(targetPath, 'utf8')),
        JSON.parse(content),
      )
      writeFileSync(targetPath, `${JSON.stringify(merged, null, 2)}\n`)
      return
    }
    if (appendableFiles.has(fileName)) {
      writeFileSync(targetPath, `${readFileSync(targetPath, 'utf8').trimEnd()}\n\n${content}`)
      return
    }
    throw new Error(`profile conflict: ${relative(assetsRoot, sourcePath)} already exists in target`)
  }

  writeFileSync(targetPath, content)
  chmodSync(targetPath, statSync(sourcePath).mode)
}

function copyTemplateTree(sourceDirectory, targetDirectory, values) {
  for (const entry of readdirSync(sourceDirectory, { withFileTypes: true })) {
    const sourcePath = join(sourceDirectory, entry.name)
    const targetPath = join(targetDirectory, entry.name)

    if (entry.isDirectory()) {
      mkdirSync(targetPath, { recursive: true })
      copyTemplateTree(sourcePath, targetPath, values)
    } else {
      writeTemplateFile(sourcePath, targetPath, values)
    }
  }
}

function collectGroups(versions, groupNames) {
  return groupNames.reduce((merged, groupName) => {
    const group = versions[groupName]
    if (group === undefined) {
      throw new Error(`unknown dependency group ${groupName}`)
    }
    return { ...merged, ...group }
  }, {})
}

/**
 * Materializes one or more profiles exactly as the skill documents it: common
 * assets, shared tooling copied into `.config/`, Git hooks, each stack
 * template in order, and a manifest merged from `versions.json`. Overlay
 * profiles append to `.gitignore` and `.env.example` and merge scripts.
 */
export function generateProject({
  targetDirectory,
  projectName,
  profiles,
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
    PROFILES: profiles.join(', '),
    PROFILES_YAML: JSON.stringify(profiles),
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

  let dependencies = {}
  let devDependencies = {}

  for (const profileName of profiles) {
    const profile = versions.profiles[profileName]
    if (profile === undefined) {
      throw new Error(`unknown profile ${profileName}`)
    }
    copyTemplateTree(resolve(assetsRoot, profile.template), targetDirectory, values)
    dependencies = { ...dependencies, ...collectGroups(versions, profile.dependencies) }
    devDependencies = { ...devDependencies, ...collectGroups(versions, profile.devDependencies) }
  }

  const manifestPath = resolve(targetDirectory, 'package.json')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  manifest.dependencies = sortedEntries(dependencies)
  manifest.devDependencies = sortedEntries(devDependencies)
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

  return { targetDirectory, values, versions }
}
