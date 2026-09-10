import type { FastifyError } from 'fastify'
import fp from 'fastify-plugin'
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from 'fastify-type-provider-zod'

export type ErrorResponse = {
  error: {
    code: string
    message: string
    issues?: { path: string, message: string }[]
  }
}

// Fastify types `code` as required, but errors raised by `reply.notFound()`
// and similar helpers omit it at runtime.
type HandledError = Omit<FastifyError, 'code'> & { code?: string }

const internalError: ErrorResponse = {
  error: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
}

/**
 * Every failure leaves the process with the same stable shape. Client faults
 * keep their status and a safe message; unexpected faults are logged with
 * full context and answered generically.
 */
export const errorHandlerPlugin = fp(
  (app, _options, done) => {
    app.setNotFoundHandler((_request, reply) => {
      return reply.code(404).send({
        error: { code: 'NOT_FOUND', message: 'Route not found' },
      } satisfies ErrorResponse)
    })

    app.setErrorHandler((error: HandledError, request, reply) => {
      if (hasZodFastifySchemaValidationErrors(error)) {
        return reply.code(400).send({
          error: {
            code: 'VALIDATION_FAILED',
            message: `Invalid request ${error.validationContext ?? 'input'}`,
            issues: error.validation.map((issue) => ({
              path: issue.instancePath,
              message: issue.message ?? 'Invalid value',
            })),
          },
        } satisfies ErrorResponse)
      }

      if (isResponseSerializationError(error)) {
        request.log.error({ err: error }, 'response does not match its schema')
        return reply.code(500).send(internalError)
      }

      if (error.statusCode !== undefined && error.statusCode >= 400 && error.statusCode < 500) {
        return reply.code(error.statusCode).send({
          error: { code: error.code ?? 'REQUEST_ERROR', message: error.message },
        } satisfies ErrorResponse)
      }

      request.log.error({ err: error }, 'unhandled error')
      return reply.code(500).send(internalError)
    })

    done()
  },
  { name: 'error-handler' },
)
