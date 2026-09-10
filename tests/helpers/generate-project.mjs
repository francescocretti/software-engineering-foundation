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

const rootOnlyScripts = new Set(['lint', 'lint:fix', 'validate', 'prepare'])

/**
 * Applies a stack profile inside a workspace directory: the template is copied
 * with the shared configuration path pointing at the repository root, the
 * workspace manifest drops root-only fields and scripts, and dependency groups
 * already hoisted to the root are not repeated.
 */
function generateWorkspace({
  hoistedGroups,
  scope,
  targetDirectory,
  values,
  versions,
  withShared,
  workspaceName,
  workspaceProfileName,
}) {
  const profile = versions.profiles[workspaceProfileName]
  if (profile === undefined) {
    throw new Error(`unknown profile ${workspaceProfileName}`)
  }

  mkdirSync(targetDirectory, { recursive: true })
  copyTemplateTree(resolve(assetsRoot, profile.template), targetDirectory, values)
  rmSync(resolve(targetDirectory, 'eslint.config.mjs'), { force: true })

  const manifestPath = resolve(targetDirectory, 'package.json')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const hoisted = new Set(hoistedGroups)

  manifest.name = `@${scope}/${workspaceName}`
  delete manifest.packageManager
  delete manifest.engines
  manifest.scripts = Object.fromEntries(
    Object.entries(manifest.scripts).filter(([script]) => !rootOnlyScripts.has(script)),
  )
  manifest.dependencies = sortedEntries({
    ...collectGroups(versions, profile.dependencies),
    ...(withShared ? { [`@${scope}/shared`]: 'workspace:^' } : {}),
  })
  manifest.devDependencies = sortedEntries(
    collectGroups(versions, profile.devDependencies.filter((group) => !hoisted.has(group))),
  )
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
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
  workspaces = {},
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
    SCOPE: projectName,
    YARN_VERSION: versions.runtime.yarn,
  }
  const rootValues = { ...values, CONFIG_ROOT: './.config' }
  const workspaceValues = { ...values, CONFIG_ROOT: '../../.config' }

  rmSync(targetDirectory, { force: true, recursive: true })
  mkdirSync(targetDirectory, { recursive: true })

  copyTemplateTree(resolve(assetsRoot, 'common'), targetDirectory, rootValues)
  copyTemplateTree(
    resolve(assetsRoot, 'tooling/eslint'),
    resolve(targetDirectory, '.config/eslint'),
    rootValues,
  )
  copyTemplateTree(
    resolve(assetsRoot, 'tooling/typescript'),
    resolve(targetDirectory, '.config/typescript'),
    rootValues,
  )
  copyTemplateTree(resolve(assetsRoot, 'tooling/git'), targetDirectory, rootValues)

  let dependencies = {}
  let devDependencies = {}

  for (const profileName of profiles) {
    const profile = versions.profiles[profileName]
    if (profile === undefined) {
      throw new Error(`unknown profile ${profileName}`)
    }
    copyTemplateTree(resolve(assetsRoot, profile.template), targetDirectory, rootValues)
    dependencies = { ...dependencies, ...collectGroups(versions, profile.dependencies) }
    devDependencies = { ...devDependencies, ...collectGroups(versions, profile.devDependencies) }

    if (profile.layout === 'monorepo') {
      const selected = { ...workspaces, shared: profile.sharedProfile }
      for (const [workspaceName, workspaceProfileName] of Object.entries(selected)) {
        generateWorkspace({
          hoistedGroups: profile.devDependencies,
          scope: projectName,
          targetDirectory: resolve(targetDirectory, profile.workspaces[workspaceName]),
          values: workspaceValues,
          versions,
          withShared: workspaceName !== 'shared',
          workspaceName,
          workspaceProfileName,
        })
      }
    }
  }

  const manifestPath = resolve(targetDirectory, 'package.json')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  manifest.dependencies = sortedEntries(dependencies)
  manifest.devDependencies = sortedEntries(devDependencies)
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

  return { targetDirectory, values, versions }
}
