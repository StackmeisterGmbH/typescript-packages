import type { Expression } from '../syntax'
import type { SystemTop } from '../../common'

export type ReplayCarrier = {
  readonly evaluate: number
}

const evaluate = ({ from, constants }: SystemTop): Expression<ReplayCarrier> => ({
  literal: (value, unit) => ({
    evaluate: unit === undefined ? value : from[unit](value, constants),
  }),
  unaryOperation: (operator, operand) => ({
    evaluate: operator.symbol === '-' ? -operand.evaluate : operand.evaluate,
  }),
  binaryOperation: (left, operator, right) => ({
    evaluate:
      operator.symbol === '+'
        ? left.evaluate + right.evaluate
        : operator.symbol === '-'
        ? left.evaluate - right.evaluate
        : operator.symbol === '*'
        ? left.evaluate * right.evaluate
        : left.evaluate / right.evaluate,
  }),
  functionCall: (fun, args) => {
    const values = args.map(arg => arg.evaluate)
    const implementations = {
      floor: () => Math.floor(values[0]),
      ceil: () => Math.ceil(values[0]),
      round: () => Math.round(values[0]),
      abs: () => Math.abs(values[0]),
      sqrt: () => Math.sqrt(values[0]),
      cbrt: () => Math.cbrt(values[0]),
      exp: () => Math.exp(values[0]),
      log: () => Math.log(values[0]),
      log10: () => Math.log10(values[0]),
      log2: () => Math.log2(values[0]),
      sin: () => Math.sin(values[0]),
      cos: () => Math.cos(values[0]),
      tan: () => Math.tan(values[0]),
      minmax: () => Math.min(values[2], Math.max(values[0], values[1])),
      min: () => Math.min(...args.map(arg => arg.evaluate)),
      max: () => Math.max(...args.map(arg => arg.evaluate)),
      div: () => Math.floor(values[0] / values[1]),
      mod: () => values[0] % values[1],
    }
    return { evaluate: implementations[fun.name]() }
  },
})

export default evaluate
