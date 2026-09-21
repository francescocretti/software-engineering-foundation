import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { configureApp } from './app.setup'
import type { Env } from './config/env'

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule)
  const config = app.get<ConfigService<Env, true>>(ConfigService)

  configureApp(app)
  await app.listen(config.get('PORT', { infer: true }), config.get('HOST', { infer: true }))
}

void bootstrap()
