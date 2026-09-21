import type { Server } from 'node:http'

import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { afterEach, describe, expect, it } from 'vitest'

import { AppModule } from '../src/app.module'
import { configureApp } from '../src/app.setup'

let app: INestApplication | undefined

const createApp = async (): Promise<Server> => {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile()
  app = moduleRef.createNestApplication({ logger: false })
  configureApp(app)
  await app.init()
  return app.getHttpServer() as Server
}

afterEach(async () => {
  await app?.close()
  app = undefined
})

describe('application', () => {
  it('reports health with security headers applied', async () => {
    const server = await createApp()
    const response = await request(server).get('/health')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ status: 'ok' })
    expect(response.headers['x-content-type-options']).toBe('nosniff')
    expect(response.headers['content-security-policy']).toBeDefined()
  })

  it('creates a greeting from a valid body', async () => {
    const server = await createApp()
    const response = await request(server).post('/greetings').send({ name: '  Ada ' })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({ greeting: 'Hello, Ada.' })
  })

  it('rejects missing, malformed and unexpected fields without echoing values', async () => {
    const server = await createApp()

    for (const payload of [{}, { name: 42 }, { name: 'Ada', role: 'admin' }, { name: 'x'.repeat(101) }]) {
      const response = await request(server).post('/greetings').send(payload)
      const body = response.body as { error: { code: string, issues: string[] } }

      expect(response.status).toBe(400)
      expect(body.error.code).toBe('VALIDATION_FAILED')
      expect(body.error.issues.length).toBeGreaterThan(0)
      expect(response.text).not.toContain('admin')
    }
  })

  it('answers unknown routes with the stable error contract', async () => {
    const server = await createApp()
    const response = await request(server).get('/missing')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      error: { code: 'NOT_FOUND', message: expect.any(String) as string },
    })
  })

  it('rate limits repeated requests from the same client', async () => {
    const server = await createApp()
    const limit = Number(process.env.THROTTLE_LIMIT)

    for (let index = 0; index < limit; index += 1) {
      expect((await request(server).get('/health')).status).toBe(200)
    }
    const limited = await request(server).get('/health')

    expect(limited.status).toBe(429)
    expect((limited.body as { error: { code: string } }).error.code).toBe('RATE_LIMITED')
  })
})
