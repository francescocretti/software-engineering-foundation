import { z } from 'zod'

const booleanFromString = z
  .enum(['true', 'false'])
  .default('false')
  .transform((value) => value === 'true')

const originList = z
  .string()
  .default('')
  .transform((value) => value.split(',').map((origin) => origin.trim()).filter(Boolean))
  .pipe(z.array(z.url({ protocol: /^https?$/ })))

export const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  HOST: z.string().min(1).default('127.0.0.1'),
  PORT: z.coerce.number().int().min(0).max(65535).default(3000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  CORS_ORIGINS: originList,
  RATE_LIMIT_MAX: z.coerce.number().int().min(1).default(100),
  RATE_LIMIT_WINDOW: z.string().min(1).default('1 minute'),
  BODY_LIMIT: z.coerce.number().int().min(1024).default(1_048_576),
  TRUST_PROXY: booleanFromString,
})

export type AppConfig = z.infer<typeof configSchema>

/**
 * Parses process-style environment variables. Fails fast with the offending
 * variable names, never their values, so startup diagnostics stay safe to log.
 */
export function loadConfig(source: Record<string, string | undefined>): AppConfig {
  const result = configSchema.safeParse(source)

  if (!result.success) {
    const names = [...new Set(result.error.issues.map((issue) => String(issue.path[0])))]
    throw new Error(`Invalid configuration for: ${names.join(', ')}`)
  }

  return result.data
}
