import { describe, expect, it } from 'vitest'

import { buildTestApp } from '../../../test/build-test-app.ts'

describe('GET /health', () => {
  it('reports the service as healthy with security headers applied', async () => {
    const app = await buildTestApp()
    const response = await app.inject({ method: 'GET', url: '/health' })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ status: 'ok' })
    expect(response.headers['x-content-type-options']).toBe('nosniff')
    expect(response.headers['content-security-policy']).toBeDefined()
    expect(response.headers['x-ratelimit-limit']).toBeDefined()

    await app.close()
  })

  it('answers unknown routes with the stable error contract', async () => {
    const app = await buildTestApp()
    const response = await app.inject({ method: 'GET', url: '/missing' })

    expect(response.statusCode).toBe(404)
    expect(response.json()).toEqual({
      error: { code: 'NOT_FOUND', message: 'Route not found' },
    })

    await app.close()
  })
})
