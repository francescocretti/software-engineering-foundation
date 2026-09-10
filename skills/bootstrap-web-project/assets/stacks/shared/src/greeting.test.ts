import { describe, expect, it } from 'vitest'

import { greetingRequestSchema } from './greeting.ts'

describe('greetingRequestSchema', () => {
  it('trims and accepts a valid name', () => {
    expect(greetingRequestSchema.parse({ name: '  Ada ' })).toEqual({ name: 'Ada' })
  })

  it('rejects unexpected properties and empty names', () => {
    expect(greetingRequestSchema.safeParse({ name: 'Ada', role: 'admin' }).success).toBe(false)
    expect(greetingRequestSchema.safeParse({ name: '   ' }).success).toBe(false)
  })
})
