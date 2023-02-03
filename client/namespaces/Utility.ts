import { v4 } from 'uuid'

const a = [1, 'two', 3, 'four']

const isString = (x): x is string => typeof x === 'string'
const b = a.filter(isString)

export const Utility = {
  uuid: () => v4(),
  isNotNull: <T>(x: T | null): x is T => !!x,
}
