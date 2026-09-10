import { Injectable } from '@nestjs/common'

export type Greeting = {
  greeting: string
}

@Injectable()
export class GreetingsService {
  greet(name: string): Greeting {
    return { greeting: `Hello, ${name}.` }
  }
}
