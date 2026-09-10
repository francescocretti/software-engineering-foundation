import { Transform, type TransformFnParams } from 'class-transformer'
import { IsString, Length } from 'class-validator'

function trimString({ value }: TransformFnParams): unknown {
  const raw: unknown = value
  return typeof raw === 'string' ? raw.trim() : raw
}

export class CreateGreetingDto {
  @Transform(trimString)
  @IsString()
  @Length(1, 100)
  name!: string
}
