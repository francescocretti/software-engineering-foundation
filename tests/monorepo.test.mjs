import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import test, { before } from 'node:test'
import { fileURLToPath } from 'node:url'

import { generateProject } from './helpers/generate-project.mjs'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const binary = (name) => resolve(repositoryRoot, 'node_modules/.bin', name)
const variants = {
  fastify: resolve(repositoryRoot, 'tests/.generated/monorepo-fastify'),
  nest: resolve(repositoryRoot, 'tests/.generated/monorepo-nest'),
}

function run(cwd, command, args) {
  return execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, CI: '1', NO_COLOR: '1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

/**
 * Yarn would link workspaces into node_modules during installation. The
 * fixture links the shared package by hand so resolution walks up to the
 * repository's installed dependencies without a network install.
 */
function linkSharedWorkspace(root, scope) {
  const scopeDirectory = resolve(root, 'node_modules', `@${scope}`)
  mkdirSync(scopeDirectory, { recursive: true })
  symlinkSync('../../packages/shared', resolve(scopeDirectory, 'shared'), 'dir')
}

const probePath = 'apps/server/src/shared-contract.ts'
const probeSource = [
  'import { greetingRequestSchema, type GreetingRequest } from \'@SCOPE/shared\'',
  '',
  'export function parseGreetingRequest(input: unknown): GreetingRequest {',
  '  return greetingRequestSchema.parse(input)',
  '}',
  '',
].join('\n')

before(() => {
  for (const [server, targetDirectory] of Object.entries(variants)) {
    generateProject({
      targetDirectory,
      projectName: `foundation-monorepo-${server}`,
      profiles: ['monorepo', 'supabase'],
      workspaces: { client: 'react-vite', server },
      securityLevel: 'R2',
      securityRationale: 'Authenticated full-stack application handling business data.',
    })
    linkSharedWorkspace(targetDirectory, `foundation-monorepo-${server}`)
  }
})

test('the monorepo layout follows STRUCT-SHAPE-001 with root-owned tooling', () => {
  const root = variants.fastify

  for (const file of [
    '.config/eslint/react.mjs',
    '.husky/pre-commit',
    'eslint.config.mjs',
    'lint-staged.config.mjs',
    'apps/client/index.html',
    'apps/client/tsconfig.app.json',
    'apps/server/src/app.ts',
    'packages/shared/src/index.ts',
    'supabase/migrations/20260910120000_profiles.sql',
  ]) {
    assert.ok(existsSync(resolve(root, file)), `missing generated file: ${file}`)
  }
  for (const file of ['apps/client/eslint.config.mjs', 'apps/server/eslint.config.mjs', 'apps/client/.husky']) {
    assert.equal(existsSync(resolve(root, file)), false, `${file} belongs to the root only`)
  }

  const rootManifest = readJson(resolve(root, 'package.json'))
  assert.deepEqual(rootManifest.workspaces, ['apps/*', 'packages/*'])
  assert.equal(rootManifest.scripts.postinstall, 'husky', 'Yarn Modern runs postinstall, not prepare')
  assert.ok('db:test' in rootManifest.scripts, 'the Supabase overlay lands on the root')
  assert.ok('eslint' in rootManifest.devDependencies)
  assert.ok('eslint-plugin-jsx-a11y' in rootManifest.devDependencies)
  assert.equal('resolutions' in rootManifest, false, 'Fastify does not need Nest overrides')

  const client = readJson(resolve(root, 'apps/client/package.json'))
  const server = readJson(resolve(root, 'apps/server/package.json'))
  const shared = readJson(resolve(root, 'packages/shared/package.json'))
  assert.equal(client.name, '@foundation-monorepo-fastify/client')
  assert.equal(server.name, '@foundation-monorepo-fastify/server')
  assert.equal(shared.name, '@foundation-monorepo-fastify/shared')
  for (const manifest of [client, server, shared]) {
    for (const field of ['packageManager', 'engines']) {
      assert.equal(field in manifest, false, `${manifest.name} must not declare ${field}`)
    }
    for (const script of ['lint', 'postinstall', 'prepare', 'validate']) {
      assert.equal(script in manifest.scripts, false, `${manifest.name} must not declare ${script}`)
    }
    assert.equal('eslint' in manifest.devDependencies, false, 'lint tooling is hoisted')
  }
  assert.equal(client.dependencies['@foundation-monorepo-fastify/shared'], 'workspace:^')
  assert.equal(server.dependencies['@foundation-monorepo-fastify/shared'], 'workspace:^')
  assert.ok('vite' in client.devDependencies)
  assert.ok('fastify' in server.dependencies)
  assert.deepEqual(Object.keys(shared.dependencies), ['zod'])

  assert.equal(existsSync(resolve(root, 'apps/server/.yarnrc.yml')), false, 'Yarn config is root-only')
  assert.match(readFileSync(resolve(root, '.yarnrc.yml'), 'utf8'), /^ {2}fastify-type-provider-zod@\*:$/m)
  assert.match(
    readFileSync(resolve(root, 'apps/client/tsconfig.app.json'), 'utf8'),
    /"extends": "\.\.\/\.\.\/\.config\/typescript\/tsconfig\.browser\.json"/,
  )
  assert.match(
    readFileSync(resolve(root, '.engineering-foundation.yml'), 'utf8'),
    /^profiles: \["monorepo","supabase"\]$/m,
  )
})

for (const [server, root] of Object.entries(variants)) {
  test(`the ${server} monorepo builds the shared package and lints every workspace from the root`, () => {
    run(root, binary('tsc'), ['-p', 'packages/shared/tsconfig.build.json'])
    assert.ok(existsSync(resolve(root, 'packages/shared/dist/index.d.ts')))

    writeFileSync(
      resolve(root, probePath),
      probeSource.replace('@SCOPE', `@foundation-monorepo-${server}`),
    )
    run(root, binary('eslint'), ['.', '--max-warnings=0'])
  })

  test(`the ${server} monorepo typechecks every workspace, including the shared contract`, () => {
    run(root, binary('tsc'), ['-p', 'packages/shared/tsconfig.json'])
    run(root, binary('tsc'), ['-p', 'apps/client/tsconfig.app.json'])
    run(root, binary('tsc'), ['-p', 'apps/client/tsconfig.node.json'])
    run(root, binary('tsc'), ['-p', 'apps/server/tsconfig.json'])
  })

  test(`the ${server} monorepo runs every workspace test suite`, () => {
    assert.match(run(resolve(root, 'packages/shared'), binary('vitest'), ['run']), /2 passed/)
    assert.match(run(resolve(root, 'apps/server'), binary('vitest'), ['run']), /6 passed/)
    if (server === 'fastify') {
      assert.match(run(resolve(root, 'apps/client'), binary('vitest'), ['run']), /3 passed/)
    }
  })
}

test('the fastify monorepo builds both applications and the server consumes the shared contract', () => {
  const root = variants.fastify

  run(resolve(root, 'apps/client'), binary('vite'), ['build'])
  assert.ok(existsSync(resolve(root, 'apps/client/dist/index.html')))

  run(resolve(root, 'apps/server'), binary('tsc'), ['-p', 'tsconfig.build.json'])
  const output = run(root, process.execPath, ['--input-type=module', '-e', [
    'import { parseGreetingRequest } from "./apps/server/dist/shared-contract.js"',
    'console.log(JSON.stringify(parseGreetingRequest({ name: "  Ada " })))',
    'try { parseGreetingRequest({ name: "Ada", role: "admin" }) } catch { console.log("rejected") }',
  ].join('\n')])
  assert.match(output, /^\{"name":"Ada"\}\nrejected/)

  rmSync(resolve(root, probePath), { force: true })
})

test('the nest monorepo builds the server with the Nest CLI', () => {
  const root = variants.nest
  const rootManifest = readJson(resolve(root, 'package.json'))

  assert.deepEqual(rootManifest.resolutions, { multer: '2.3.0' })

  run(resolve(root, 'apps/server'), binary('nest'), ['build'])
  assert.ok(existsSync(resolve(root, 'apps/server/dist/main.js')))
  assert.ok(existsSync(resolve(root, 'apps/server/dist/shared-contract.js')))

  rmSync(resolve(root, probePath), { force: true })
})
