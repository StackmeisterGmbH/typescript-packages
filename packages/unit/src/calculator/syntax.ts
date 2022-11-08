const createPrefixOperator = (symbol: string, bindingPower: number) => ({
  type: 'PrefixOperator' as const,
  symbol,
  bindingPower,
})
export type PrefixOperator = ReturnType<typeof createPrefixOperator>

const createInfixOperator = (
  symbol: string,
  bindingPowerLeft: number,
  bindingPowerRight: number,
) => ({ type: 'InfixOperator' as const, symbol, bindingPowerLeft, bindingPowerRight })
export type InfixOperator = ReturnType<typeof createInfixOperator>

export type Operator = PrefixOperator | InfixOperator

export const infixOperators = [
  createInfixOperator('+', 1, 2),
  createInfixOperator('-', 1, 2),
  createInfixOperator('*', 3, 4),
  createInfixOperator('/', 3, 4),
]

export const prefixOperators = [createPrefixOperator('-', 5)]

const createFunction = <Name extends string>(name: Name, arity: number) => ({
  type: 'function' as const,
  name,
  arity,
  hasValidArity: (args: readonly unknown[]) =>
    args.length !== 0 && (arity === -1 || args.length === arity),
})

export const functions = [
  createFunction('floor', 1),
  createFunction('ceil', 1),
  createFunction('round', 1),
  createFunction('abs', 1),
  createFunction('sqrt', 1),
  createFunction('cbrt', 1),
  createFunction('exp', 1),
  createFunction('log', 1),
  createFunction('log10', 1),
  createFunction('log2', 1),
  createFunction('sin', 1),
  createFunction('cos', 1),
  createFunction('tan', 1),
  createFunction('minmax', 3),
  createFunction('min', -1),
  createFunction('max', -1),
  createFunction('div', 2),
  createFunction('mod', 2),
] as const
export type FunctionCall = typeof functions[number]

export type Expression<Carrier> = {
  readonly literal: (value: number, unit: string | undefined) => Carrier
  readonly binaryOperation: (left: Carrier, operator: InfixOperator, right: Carrier) => Carrier
  readonly unaryOperation: (operator: PrefixOperator, operand: Carrier) => Carrier
  readonly functionCall: (fun: FunctionCall, args: readonly Carrier[]) => Carrier
}
