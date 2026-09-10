import { z } from 'zod'

// Contracts shared by the client and the server. Keep this package limited to
// portable schemas, types and pure functions: no runtime-specific imports.
export const greetingRequestSchema = z.strictObject({
  name: z.string().trim().min(1).max(100),
})

export const greetingResponseSchema = z.object({
  greeting: z.string(),
})

export type GreetingRequest = z.infer<typeof greetingRequestSchema>
export type GreetingResponse = z.infer<typeof greetingResponseSchema>
