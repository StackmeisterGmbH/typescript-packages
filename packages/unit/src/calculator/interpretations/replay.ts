import type { Expression } from '../syntax'

export type ReplayCarrier = {
  readonly type: 'ReplayCarrier'

  readonly replay: <Carrier>(syntax: Expression<Carrier>) => Carrier
}
const createReplayCarrier = (
  replay: <Carrier>(syntax: Expression<Carrier>) => Carrier,
): ReplayCarrier => ({
  type: 'ReplayCarrier',
  replay,
})

const replay: Expression<ReplayCarrier> = {
  literal: (value, unit) => createReplayCarrier(syntax => syntax.literal(value, unit)),
  unaryOperation: (operator, operand) =>
    createReplayCarrier(syntax => syntax.unaryOperation(operator, operand.replay(syntax))),
  binaryOperation: (left, operator, right) =>
    createReplayCarrier(syntax =>
      syntax.binaryOperation(left.replay(syntax), operator, right.replay(syntax)),
    ),
  functionCall: (fun, args) =>
    createReplayCarrier(syntax =>
      syntax.functionCall(
        fun,
        args.map(arg => arg.replay(syntax)),
      ),
    ),
}

export default replay
