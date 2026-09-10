import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import test, { before } from 'node:test'
import { fileURLToPath } from 'node:url'

import { generateProject } from './helpers/generate-project.mjs'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const projectDirectory = resolve(repositoryRoot, 'tests/.generated/fastify-supabase')
const binary = (name) => resolve(repositoryRoot, 'node_modules/.bin', name)

function run(command, args) {
  return execFileSync(command, args, {
    cwd: projectDirectory,
    encoding: 'utf8',
    env: { ...process.env, CI: '1', NO_COLOR: '1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

let generated

before(() => {
  generated = generateProject({
    targetDirectory: projectDirectory,
    projectName: 'foundation-fastify-supabase-fixture',
    profiles: ['fastify', 'supabase'],
    securityLevel: 'R2',
    securityRationale: 'Authenticated users own personal profile data.',
  })
})

test('the Supabase overlay composes onto a backend profile', () => {
  const manifest = JSON.parse(readFileSync(resolve(projectDirectory, 'package.json'), 'utf8'))

  assert.equal(manifest.name, 'foundation-fastify-supabase-fixture')
  assert.ok('dev' in manifest.scripts, 'base profile scripts survive the overlay')
  for (const script of ['db:start', 'db:reset', 'db:test', 'db:types', 'db:migration:new']) {
    assert.ok(script in manifest.scripts, `missing database script: ${script}`)
  }
  assert.equal(
    manifest.dependencies['@supabase/supabase-js'],
    generated.versions.supabaseDependencies['@supabase/supabase-js'],
  )
  assert.equal(
    manifest.devDependencies.supabase,
    generated.versions.supabaseDevDependencies.supabase,
  )
  assert.equal(manifest.dependencies.fastify, generated.versions.fastifyDependencies.fastify)

  const gitignore = readFileSync(resolve(projectDirectory, '.gitignore'), 'utf8')
  assert.match(gitignore, /^dist\/$/m)
  assert.match(gitignore, /^supabase\/\.temp\/$/m)

  const envExample = readFileSync(resolve(projectDirectory, '.env.example'), 'utf8')
  assert.match(envExample, /^PORT=/m)
  assert.match(envExample, /^SUPABASE_SECRET_KEY=$/m)
  assert.match(envExample, /^SUPABASE_PUBLISHABLE_KEY=$/m)
  assert.doesNotMatch(envExample, /sb_secret_|sb_publishable_|eyJ/)

  assert.match(
    readFileSync(resolve(projectDirectory, '.engineering-foundation.yml'), 'utf8'),
    /^profiles: \["fastify","supabase"\]$/m,
  )
  assert.match(
    readFileSync(resolve(projectDirectory, 'supabase/config.toml'), 'utf8'),
    /^project_id = "foundation-fastify-supabase-fixture"$/m,
  )
})

test('every migrated table enables RLS with explicit grants and policies', () => {
  const migrationsDirectory = resolve(projectDirectory, 'supabase/migrations')
  const migrations = readdirSync(migrationsDirectory).filter((file) => file.endsWith('.sql'))

  assert.ok(migrations.length > 0, 'expected at least one migration')

  for (const file of migrations) {
    const sql = readFileSync(resolve(migrationsDirectory, file), 'utf8')
    const tables = [...sql.matchAll(/create table (?:if not exists )?([\w.]+)/gi)].map(
      (match) => match[1],
    )

    for (const table of tables) {
      const escaped = table.replaceAll('.', '\\.')
      assert.match(sql, new RegExp(`alter table ${escaped} enable row level security`, 'i'), `${table} lacks RLS`)
      assert.match(sql, new RegExp(`revoke all on table ${escaped} from anon, authenticated`, 'i'), `${table} keeps default grants`)
      assert.match(sql, new RegExp(`create policy \\w+ on ${escaped}`, 'i'), `${table} has no policy`)
      assert.match(sql, /\(select auth\.uid\(\)\)/, `${table} policies must wrap auth.uid() in a subselect`)
    }
    assert.doesNotMatch(sql, /security definer/i, 'no SECURITY DEFINER function without an explicit review')
  }
})

test('the pgTAP suite exercises anonymous, owner and cross-user paths', () => {
  const testsDirectory = resolve(projectDirectory, 'supabase/tests')
  const suites = readdirSync(testsDirectory).filter((file) => file.endsWith('.test.sql'))

  assert.ok(suites.length > 0, 'expected at least one pgTAP suite')

  for (const file of suites) {
    const sql = readFileSync(resolve(testsDirectory, file), 'utf8')
    assert.match(sql, /^begin;/m)
    assert.match(sql, /select plan\(\d+\);/)
    assert.match(sql, /set local role anon;/)
    assert.match(sql, /set local role authenticated;/)
    assert.match(sql, /set local request\.jwt\.claim\.sub = /)
    assert.match(sql, /throws_ok\(/)
    assert.match(sql, /select \* from finish\(\);/)
    assert.match(sql, /^rollback;/m)
  }
})

test('the base profile still passes lint with the overlay applied', () => {
  run(binary('eslint'), ['.', '--max-warnings=0'])
})

test(
  'the local Supabase stack applies the migration and passes the pgTAP suite',
  { skip: process.env.FOUNDATION_SUPABASE_LIVE !== '1' && 'set FOUNDATION_SUPABASE_LIVE=1 with Docker running' },
  () => {
    try {
      run(binary('supabase'), ['start', '--ignore-health-check'])
      const output = run(binary('supabase'), ['test', 'db'])
      assert.match(output, /All tests successful/)
    } finally {
      run(binary('supabase'), ['stop', '--no-backup'])
    }
  },
)
