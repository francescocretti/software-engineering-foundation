import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'

import { CreateGreetingDto } from './dto/create-greeting.dto'
import { GreetingsService, type Greeting } from './greetings.service'

@Controller('greetings')
export class GreetingsController {
  constructor(private readonly greetings: GreetingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateGreetingDto): Greeting {
    return this.greetings.greet(body.name)
  }
}
