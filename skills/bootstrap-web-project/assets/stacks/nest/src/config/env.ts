import { z } from 'zod'

const originList = z
  .string()
  .default('')
  .transform((value) => value.split(',').map((origin) => origin.trim()).filter(Boolean))
  .pipe(z.array(z.url({ protocol: /^https?$/ })))

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  HOST: z.string().min(1).default('127.0.0.1'),
  PORT: z.coerce.number().int().min(0).max(65535).default(3000),
  CORS_ORIGINS: originList,
  THROTTLE_LIMIT: z.coerce.number().int().min(1).default(100),
  THROTTLE_TTL_MS: z.coerce.number().int().min(1000).default(60_000),
})

export type Env = z.infer<typeof envSchema>

/**
 * Validates the process environment for `ConfigModule`. Fails fast with the
 * offending variable names, never their values.
 */
export function validateEnv(source: Record<string, unknown>): Env {
  const result = envSchema.safeParse(source)

  if (!result.success) {
    const names = [...new Set(result.error.issues.map((issue) => String(issue.path[0])))]
    throw new Error(`Invalid configuration for: ${names.join(', ')}`)
  }

  return result.data
}
