import closeWithGrace from 'close-with-grace'

import { buildApp } from './app.ts'
import { loadConfig } from './config.ts'
import { SHUTDOWN_GRACE_PERIOD_MS } from './server.constants.ts'

const config = loadConfig(process.env)
const app = await buildApp({ config })

closeWithGrace({ delay: SHUTDOWN_GRACE_PERIOD_MS }, async ({ err }) => {
  if (err !== undefined) {
    app.log.error({ err }, 'shutting down after an unrecoverable error')
  }
  await app.close()
})

await app.listen({ host: config.HOST, port: config.PORT })
