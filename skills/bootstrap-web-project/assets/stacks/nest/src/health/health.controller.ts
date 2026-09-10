import { Controller, Get } from '@nestjs/common'

export type HealthReport = {
  status: 'ok'
}

@Controller('health')
export class HealthController {
  @Get()
  check(): HealthReport {
    return { status: 'ok' }
  }
}
