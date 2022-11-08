import parse from './parse'
import evaluate from './interpretations/evaluate'
import type { SystemTop } from '../common'
import print from './interpretations/print'

const validUnits = (system: SystemTop) => Object.keys(system.from)

export const evaluateExpression = (system: SystemTop, input: string) =>
  parse(validUnits(system), evaluate(system))(input).evaluate

export const printExpression = (system: SystemTop, input: string) =>
  parse(validUnits(system), print)(input).print
