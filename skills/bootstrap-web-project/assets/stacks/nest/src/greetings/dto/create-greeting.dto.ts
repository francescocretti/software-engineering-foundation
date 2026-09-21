import { Transform, type TransformFnParams } from 'class-transformer'
import { IsString, Length } from 'class-validator'

import { MAX_GREETING_NAME_LENGTH } from '../greetings.constants'

const trimString = ({ value }: TransformFnParams): unknown => {
  const raw: unknown = value
  return typeof raw === 'string' ? raw.trim() : raw
}

export class CreateGreetingDto {
  @Transform(trimString)
  @IsString()
  @Length(1, MAX_GREETING_NAME_LENGTH)
  name!: string
}
