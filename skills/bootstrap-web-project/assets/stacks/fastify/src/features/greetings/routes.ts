import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

// Request schemas are strict: unexpected properties are rejected, not ignored.
const createGreetingBodySchema = z.strictObject({
  name: z.string().trim().min(1).max(100),
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
        response: { 201: greetingResponseSchema },
      },
    },
    (request, reply) => {
      reply.code(201)
      return { greeting: `Hello, ${request.body.name}.` }
    },
  )

  done()
}
