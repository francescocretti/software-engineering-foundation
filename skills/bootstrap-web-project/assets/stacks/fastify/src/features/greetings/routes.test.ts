import { describe, expect, it } from 'vitest'

import { buildTestApp } from '../../../test/build-test-app.ts'

describe('POST /greetings', () => {
  it('creates a greeting from a valid body', async () => {
    const app = await buildTestApp()
    const response = await app.inject({
      method: 'POST',
      url: '/greetings',
      payload: { name: '  Ada ' },
    })

    expect(response.statusCode).toBe(201)
    expect(response.json()).toEqual({ greeting: 'Hello, Ada.' })

    await app.close()
  })

  it('rejects missing, malformed and unexpected fields without echoing values', async () => {
    const app = await buildTestApp()

    for (const payload of [{}, { name: 42 }, { name: 'Ada', role: 'admin' }, { name: 'x'.repeat(101) }]) {
      const response = await app.inject({ method: 'POST', url: '/greetings', payload })
      const body = response.json<{ error: { code: string, issues: unknown[] } }>()

      expect(response.statusCode).toBe(400)
      expect(body.error.code).toBe('VALIDATION_FAILED')
      expect(body.error.issues.length).toBeGreaterThan(0)
      expect(response.body).not.toContain('admin')
    }

    await app.close()
  })

  it('bounds the request body size', async () => {
    const app = await buildTestApp({ BODY_LIMIT: '1024' })
    const response = await app.inject({
      method: 'POST',
      url: '/greetings',
      payload: { name: 'x'.repeat(2048) },
    })

    expect(response.statusCode).toBe(413)
    expect(response.json<{ error: { code: string } }>().error.code).toBe('FST_ERR_CTP_BODY_TOO_LARGE')

    await app.close()
  })

  it('rate limits repeated requests from the same client', async () => {
    const app = await buildTestApp({ RATE_LIMIT_MAX: '2' })

    await app.inject({ method: 'GET', url: '/health' })
    await app.inject({ method: 'GET', url: '/health' })
    const limited = await app.inject({ method: 'GET', url: '/health' })

    expect(limited.statusCode).toBe(429)
    expect(limited.json<{ error: { code: string } }>().error.code).toBe('RATE_LIMITED')

    await app.close()
  })
})
