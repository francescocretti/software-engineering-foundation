import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

import { StableErrorFilter } from './common/stable-error.filter'
import { validateEnv, type Env } from './config/env'
import { GreetingsModule } from './greetings/greetings.module'
import { HealthModule } from './health/health.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => ({
        throttlers: [
          {
            limit: config.get('THROTTLE_LIMIT', { infer: true }),
            ttl: config.get('THROTTLE_TTL_MS', { infer: true }),
          },
        ],
      }),
    }),
    HealthModule,
    GreetingsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_FILTER, useClass: StableErrorFilter },
  ],
})
export class AppModule {}
