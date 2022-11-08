import type { Expression } from '../syntax'

const combine = <FirstCarrier, SecondCarrier>(
  firstSyntax: Expression<FirstCarrier>,
  secondSyntax: Expression<SecondCarrier>,
): Expression<FirstCarrier & SecondCarrier> =>
  Object.fromEntries(
    Object.keys(firstSyntax).map(key => [
      key,
      (...args: readonly never[]) => ({
        ...(firstSyntax[key as never] as any)(...args),
        ...(secondSyntax[key as never] as any)(...args),
      }),
    ]),
  ) as never

export default combine
