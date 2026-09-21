import { buildApp, type App } from '../src/app.ts'
import { loadConfig } from '../src/config.ts'

/**
 * Builds the complete application against an isolated configuration so tests
 * exercise validation, security plugins and the error contract exactly as
 * production does, without reading the process environment.
 */
export const buildTestApp = async (
  overrides: Record<string, string> = {},
): Promise<App> => {
  const config = loadConfig({ NODE_ENV: 'test', LOG_LEVEL: 'silent', ...overrides })
  return buildApp({ config, logger: false })
}
