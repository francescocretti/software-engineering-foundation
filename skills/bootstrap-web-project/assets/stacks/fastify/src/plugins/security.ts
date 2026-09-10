import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import fp from 'fastify-plugin'

import type { AppConfig } from '../config.ts'

export type SecurityPluginOptions = {
  config: AppConfig
}

/**
 * Security headers, CORS allowlist and rate limiting apply to the whole
 * application, so the plugin opts out of Fastify encapsulation.
 */
export const securityPlugin = fp<SecurityPluginOptions>(
  async (app, { config }) => {
    await app.register(helmet)

    if (config.CORS_ORIGINS.length > 0) {
      await app.register(cors, {
        origin: config.CORS_ORIGINS,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      })
    }

    await app.register(rateLimit, {
      max: config.RATE_LIMIT_MAX,
      timeWindow: config.RATE_LIMIT_WINDOW,
      errorResponseBuilder: (_request, context) => {
        const error = new Error(`Rate limit exceeded, retry in ${context.after}`)
        return Object.assign(error, {
          code: context.ban ? 'BANNED' : 'RATE_LIMITED',
          statusCode: context.statusCode,
        })
      },
    })
  },
  { name: 'security' },
)
