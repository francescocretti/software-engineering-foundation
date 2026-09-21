import { ValidationPipe, type INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import helmet from 'helmet'

import type { Env } from './config/env'

/**
 * Applies the security middleware, CORS allowlist and strict validation to an
 * application instance. `main.ts` and the end-to-end tests share it so tests
 * exercise the production configuration.
 */
export const configureApp = (app: INestApplication): void => {
  const config = app.get<ConfigService<Env, true>>(ConfigService)
  const origins = config.get('CORS_ORIGINS', { infer: true })

  app.use(helmet())

  if (origins.length > 0) {
    app.enableCors({
      origin: origins,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    })
  }

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
      whitelist: true,
    }),
  )
  app.enableShutdownHooks()
}
