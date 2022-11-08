import type { Expression } from '../syntax'

export type LiteralExpressionNode = {
  readonly type: 'literal'

  readonly value: number
  readonly unit: string | undefined
}
export const createLiteralExpressionNode = (
  value: number,
  unit: string | undefined,
): LiteralExpressionNode => ({ type: 'literal', value, unit })

export type BinaryOperatorExpressionNode = {
  readonly type: 'binaryOperator'

  readonly left: ExpressionNode
  readonly symbol: string
  readonly right: ExpressionNode
}
export const createBinaryOperatorExpressionNode = (
  left: ExpressionNode,
  symbol: string,
  right: ExpressionNode,
): BinaryOperatorExpressionNode => ({ type: 'binaryOperator', left, symbol, right })

export type UnaryOperatorExpressionNode = {
  readonly type: 'unaryOperator'

  readonly symbol: string
  readonly operand: ExpressionNode
}
export const createUnaryOperatorExpressionNode = (
  symbol: string,
  operand: ExpressionNode,
): UnaryOperatorExpressionNode => ({ type: 'unaryOperator', symbol, operand })

export type FunctionCallExpressionNode = {
  readonly type: 'functionCall'

  readonly name: string
  readonly args: readonly ExpressionNode[]
}
export const createFunctionCallExpressionNode = (
  name: string,
  args: readonly ExpressionNode[],
): FunctionCallExpressionNode => ({ type: 'functionCall', name, args })

export type ExpressionNode =
  | LiteralExpressionNode
  | BinaryOperatorExpressionNode
  | UnaryOperatorExpressionNode
  | FunctionCallExpressionNode

export type ReifyCarrier = {
  readonly reify: ExpressionNode
}

const reify: Expression<ReifyCarrier> = {
  literal: (value, unit) => ({ reify: createLiteralExpressionNode(value, unit) }),
  unaryOperation: (operator, operand) => ({
    reify: createUnaryOperatorExpressionNode(operator.symbol, operand.reify),
  }),
  binaryOperation: (left, operator, right) => ({
    reify: createBinaryOperatorExpressionNode(left.reify, operator.symbol, right.reify),
  }),
  functionCall: (fun, args) => ({
    reify: createFunctionCallExpressionNode(
      fun.name,
      args.map(arg => arg.reify),
    ),
  }),
}

export default reify
