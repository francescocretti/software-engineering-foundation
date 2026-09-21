import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { HTTP_CREATED } from '../../http.constants.ts'
import { MAX_GREETING_NAME_LENGTH } from './greetings.constants.ts'

// Request schemas are strict: unexpected properties are rejected, not ignored.
const createGreetingBodySchema = z.strictObject({
  name: z.string().trim().min(1).max(MAX_GREETING_NAME_LENGTH),
})

const greetingResponseSchema = z.object({
  greeting: z.string(),
})

export const greetingRoutes: FastifyPluginCallbackZod = (app, _options, done) => {
  app.post(
    '/greetings',
    {
      schema: {
        body: createGreetingBodySchema,
        response: { [HTTP_CREATED]: greetingResponseSchema },
      },
    },
    (request, reply) => {
      reply.code(HTTP_CREATED)
      return { greeting: `Hello, ${request.body.name}.` }
    },
  )

  done()
}
