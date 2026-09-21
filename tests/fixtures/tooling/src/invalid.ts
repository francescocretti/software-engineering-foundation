import { MAX_LABEL_LENGTH } from './valid.constants.ts'

export function unsafeIdentity(value: any) {
  return value
}

const boundExpression = function (value: string): string {
  return value
}

export const exceedsBudget = (length: number): boolean =>
  length > MAX_LABEL_LENGTH && length < 4096 && boundExpression('x').length > 0
