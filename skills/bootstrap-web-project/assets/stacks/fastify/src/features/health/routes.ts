import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { HTTP_OK } from '../../http.constants.ts'

const healthResponseSchema = z.object({
  status: z.literal('ok'),
})

export const healthRoutes: FastifyPluginCallbackZod = (app, _options, done) => {
  app.get(
    '/health',
    {
      schema: {
        response: { [HTTP_OK]: healthResponseSchema },
      },
    },
    () => ({ status: 'ok' as const }),
  )

  done()
}
