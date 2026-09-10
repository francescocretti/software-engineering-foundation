import { Test } from '@nestjs/testing'
import { describe, expect, it } from 'vitest'

import { GreetingsService } from './greetings.service'

describe('GreetingsService', () => {
  it('greets by name', async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [GreetingsService],
    }).compile()

    expect(moduleRef.get(GreetingsService).greet('Ada')).toEqual({ greeting: 'Hello, Ada.' })
  })
})
