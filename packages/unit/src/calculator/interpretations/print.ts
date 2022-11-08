import type { Expression } from '../syntax'

export type PrintCarrier = {
  readonly print: string
}

const print: Expression<PrintCarrier> = {
  literal: (value, unit) => ({ print: `${value}${unit ?? ''}` }),
  unaryOperation: (operator, operand) => ({ print: `(${operator.symbol}(${operand.print}))` }),
  binaryOperation: (left, operator, right) => ({
    print: `(${left.print} ${operator.symbol} ${right.print})`,
  }),
  functionCall: (fun, args) => ({
    print: `${fun.name}(${args.map(arg => arg.print).join(', ')})`,
  }),
}

export default print
