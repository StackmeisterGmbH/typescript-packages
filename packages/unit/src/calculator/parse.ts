import type { Expression, FunctionCall, InfixOperator, PrefixOperator } from './syntax'
import { functions, infixOperators, prefixOperators } from './syntax'
import { consume, constrained } from '../utils/utils'

// `index` is the current index into the input string. It is only used for error reporting.
// `word` is the suffix of the input string that is yet to be parsed.
type ParserState = {
  readonly index: number
  readonly word: string
}

// These values do not change during parsing.
// `validUnits` is the list of units (e.g. 'px' or 'm') that the parser will consider when parsing
// a numeric value.
// `syntax` is the implementation of the AST resulting from the parse
type ParserContext<Carrier> = {
  readonly validUnits: readonly string[]
  readonly syntax: Expression<Carrier>
}

type BaseParseResult = {
  readonly type: string
  readonly state: ParserState
}

const createParseResultOk =
  <Carrier>({ word, index }: ParserState) =>
  (data: Carrier, read: number) =>
    constrained<BaseParseResult>()({
      type: 'ParseResultOk' as const,
      state: { index: index + read, word: word.slice(read) },
      data,
      read,
    })
type ParseResultOk<Carrier> = ReturnType<ReturnType<typeof createParseResultOk<Carrier>>>

const createParseResultError = (state: ParserState, message: string) =>
  constrained<BaseParseResult>()({ type: 'ParseResultError' as const, state, message })
type ParseResultError = ReturnType<typeof createParseResultError>

type ParseResult<Carrier> = ParseResultOk<Carrier> | ParseResultError

type Parser<Carrier> = (context: ParserContext<Carrier>, state: ParserState) => ParseResult<Carrier>

const isEmpty = (value: string | undefined) => value === undefined || value === ''

const whiteSpaceRegex = /^\s+/
const stripWhiteSpace = (word: string, index: number): ParserState => {
  const [{ length }] = whiteSpaceRegex.exec(word) ?? ['']
  return { word: word.slice(length), index: index + length }
}

const numberRegex = /^\s*(?<integral>[0-9]*)(?:\.(?<fractional>[0-9]*))?e?(?<exponent>[0-9]*)/
const parseNumber =
  <Carrier>(): Parser<Carrier> =>
  ({ validUnits, syntax }, state) => {
    const nextNumber = numberRegex.exec(state.word)
    if (nextNumber === null) {
      return createParseResultError(state, 'Expected a number')
    }
    const [match] = nextNumber
    const { integral, fractional, exponent } = nextNumber.groups!
    if (isEmpty(integral) && isEmpty(fractional) && isEmpty(exponent)) {
      return createParseResultError(state, 'A number cannot be empty')
    }
    if (isEmpty(integral) && isEmpty(fractional) && !isEmpty(exponent)) {
      return createParseResultError(state, 'A number cannot consist of only an exponent')
    }

    const nextWord = state.word.slice(match.length)
    const unit = validUnits.find(unit => nextWord.startsWith(unit))

    return createParseResultOk<Carrier>(state)(
      syntax.literal(parseFloat(match), unit),
      match.length + (unit?.length ?? 0),
    )
  }

type ParenthesisStackItem = {
  readonly type: 'ParenthesisStackItem'
}

const createFunctionCallStackItem = <Carrier>(fun: FunctionCall, args: readonly Carrier[]) => ({
  type: 'FunctionCallStackItem' as const,
  fun,
  args,
  addArgument: (argument: Carrier) =>
    createFunctionCallStackItem<Carrier>(fun, [...args, argument]),
  toExpression: (syntax: Expression<Carrier>) => syntax.functionCall(fun, args),
  hasValidArity: () => fun.hasValidArity(args),
})
type FunctionCallStackItem<Carrier> = ReturnType<typeof createFunctionCallStackItem<Carrier>>

type BaseIncompleteOperatorStackItem = {
  readonly bindingPower: number
}

type IncompletePrefixOperatorStackItem = BaseIncompleteOperatorStackItem & {
  readonly type: 'IncompletePrefixOperatorStackItem'
  readonly operator: PrefixOperator
}

type IncompleteInfixOperatorStackItem<Carrier> = BaseIncompleteOperatorStackItem & {
  readonly type: 'IncompleteInfixOperatorStackItem'
  readonly operator: InfixOperator
  readonly left: Carrier
}

type IncompleteStackItem<Carrier> =
  | IncompletePrefixOperatorStackItem
  | IncompleteInfixOperatorStackItem<Carrier>

// Stack items tell us where we are in the process of parsing a non-terminal.
// - An IncompleteStackItem can be completed by a single value
// - A ParenthesisStackItem means we are inside a parenthesised expression
// - A FunctionCallStackItem means we are trying to find a comma separated list of values for the
//   arguments of a function call.
type StackItem<Carrier> =
  | IncompleteStackItem<Carrier>
  | ParenthesisStackItem
  | FunctionCallStackItem<Carrier>

type ParseStack<Carrier> = ReadonlyArray<StackItem<Carrier>>

// Execute a pseudo continuation
const complete = <Carrier>(
  syntax: Expression<Carrier>,
  item: IncompleteStackItem<Carrier>,
  value: Carrier,
): Carrier =>
  item.type === 'IncompletePrefixOperatorStackItem'
    ? syntax.unaryOperation(item.operator, value)
    : syntax.binaryOperation(item.left, item.operator, value)

const tryComplete = <Carrier>(
  syntax: Expression<Carrier>,
  item: StackItem<Carrier>,
  value: Carrier,
): Carrier | undefined =>
  item.type === 'ParenthesisStackItem' || item.type === 'FunctionCallStackItem'
    ? undefined
    : complete(syntax, item, value)

// When we know that the text of a value can extend no longer (e.g. because the next symbol is a
// closed parenthesis), we complete all the items on our stack, until we find a parenthesis
// continuation, or a function call continuation.
const collapseStack = <Carrier>(
  parseStack: ParseStack<Carrier>,
  value: Carrier,
  syntax: Expression<Carrier>,
) => consume(parseStack, value, (item, value) => tryComplete(syntax, item, value))

// `value` is the last completed node
const parseOperator =
  <Carrier>(parseStack: ParseStack<Carrier>, value: Carrier): Parser<Carrier> =>
  (context, state) => {
    const { word, index } = state
    if (word === '') {
      // The complete input expression may end on an operator non-terminal, but only if there are no
      // more continuations waiting on the stack.
      const [result, , nextItem] = collapseStack(parseStack, value, context.syntax)
      return nextItem === undefined
        ? createParseResultOk<Carrier>(state)(result, 0)
        : createParseResultError(state, 'Unexpected end of input')
    }

    if (word[0] === ')') {
      const [result, restStack, nextItem] = collapseStack(parseStack, value, context.syntax)

      if (nextItem === undefined) {
        return createParseResultError(state, 'Too many closing parentheses')
      }

      switch (nextItem.type) {
        case 'ParenthesisStackItem':
          // We are closing a parenthesised expression
          return parseOperator<Carrier>(restStack, result)(
            context,
            stripWhiteSpace(word.slice(1), index + 1),
          )
        case 'FunctionCallStackItem': {
          // We are closing a function call. Collect all the arguments into a single function call,
          // according to the syntax implementation.

          const functionCall = nextItem.addArgument(result)

          if (!functionCall.hasValidArity()) {
            return createParseResultError(
              state,
              functionCall.fun.arity === -1
                ? `Function ${functionCall.fun.name} expects a positive number of arguments, but none were given`
                : `Function ${functionCall.fun.name} expects ${functionCall.fun.arity} arguments, but received ${functionCall.args.length}`,
            )
          }

          return parseOperator<Carrier>(restStack, functionCall.toExpression(context.syntax))(
            context,
            stripWhiteSpace(word.slice(1), index + 1),
          )
        }
      }
    }

    if (word[0] === ',') {
      // We only expect to find a comma if we are inside a function call continuation.
      // If so, remember the currently completed value as the next argument of the function call,
      // and continue looking for the rest.

      const [argument, restStack, nextItem] = collapseStack(parseStack, value, context.syntax)

      return nextItem === undefined || nextItem.type !== 'FunctionCallStackItem'
        ? createParseResultError(state, 'Found a comma outside of a function call')
        : parseValue<Carrier>([nextItem.addArgument(argument), ...restStack])(
            context,
            stripWhiteSpace(word.slice(1), index + 1),
          )
    }

    // If the expression hasn't ended yet, we expect to find an infix operator in this position.
    const operator = infixOperators.find(operator => word.startsWith(operator.symbol))
    if (operator === undefined) {
      return createParseResultError(state, 'Expected an infix operator')
    }

    // Now follows the heart of Pratt parsing. If the current operator bind less tightly on the
    // left, than the previous operator did we need give this value to the previous operator.
    // We keep doing this until we finally bind more tightly than the previous operator, or we find
    // a continuation that does not fit, in which case the next parsing step will spot error.

    const [left, restStack, nextItem] = consume(parseStack, value, (item, value) =>
      (item.type === 'IncompletePrefixOperatorStackItem' ||
        item.type === 'IncompleteInfixOperatorStackItem') &&
      operator.bindingPowerLeft <= item.bindingPower
        ? complete(context.syntax, item, value)
        : undefined,
    )

    // Once the current operator binds the value to its left more tightly than the previous operator
    // binds it to the right, we snatch it as the left hand side of the current operator and
    // continue parsing the right hand side of the operator

    return parseValue<Carrier>([
      {
        type: 'IncompleteInfixOperatorStackItem',
        bindingPower: operator.bindingPowerRight,
        operator,
        left,
      },
      ...(nextItem === undefined ? [] : [nextItem, ...restStack]),
    ])(context, stripWhiteSpace(word.slice(operator.symbol.length), index + operator.symbol.length))
  }

const parseValue =
  <Carrier>(parseStack: ParseStack<Carrier>): Parser<Carrier> =>
  (context, state) => {
    const { word, index } = state
    if (word === '') {
      return createParseResultError(state, 'Unexpected end of string')
    }
    if (word[0] === ')') {
      return createParseResultError(state, 'Unexpected closed parenthesis')
    }
    if (word[0] === '(') {
      // Store the fact that we are in the process of evaluating a parenthesised expression as a
      // pseudo continuation on the stack
      return parseValue<Carrier>([{ type: 'ParenthesisStackItem' }, ...parseStack])(
        context,
        stripWhiteSpace(word.slice(1), index + 1),
      )
    }

    // Try to interpret the next part of the input as a number (possibly with unit)
    const numberResult = parseNumber<Carrier>()(context, { word, index })

    if (numberResult.type === 'ParseResultOk') {
      const {
        data: number,
        state: { word, index },
      } = numberResult

      // After a number comes an operator
      return parseOperator<Carrier>(parseStack, number)(context, stripWhiteSpace(word, index))
    }

    // Instead of a number, a value might also start with a prefix operator first
    const operator = prefixOperators.find(operator => word.startsWith(operator.symbol))
    if (operator !== undefined) {
      // Store the fact that we are currently trying to complete a prefix operator as a pseudo
      // continuation on the stack. Then we must still find the value that this prefix operator
      // operates on
      return parseValue<Carrier>([
        {
          type: 'IncompletePrefixOperatorStackItem',
          bindingPower: operator.bindingPower,
          operator,
        },
        ...parseStack,
      ])(
        context,
        stripWhiteSpace(word.slice(operator.symbol.length), index + operator.symbol.length),
      )
    }

    // Instead of starting with a prefix operator, a value can also be a function call
    const fun = functions.find(fun => word.startsWith(fun.name))
    if (fun !== undefined) {
      const { word: nextWord, index: nextIndex } = stripWhiteSpace(
        word.slice(fun.name.length),
        index + fun.name.length,
      )

      if (nextWord[0] !== '(') {
        return createParseResultError(state, 'Expected an open parenthesis after a function name')
      }

      // Store the fact that we are currently trying to complete a function call as a pseudo
      // continuation on the stack. Then we must find the value of each argument.
      return parseValue<Carrier>([createFunctionCallStackItem<Carrier>(fun, []), ...parseStack])(
        context,
        stripWhiteSpace(nextWord.slice(1), nextIndex + 1),
      )
    }

    return createParseResultError(
      numberResult.state,
      'Expected a numeric value, a prefix operator, or a function call',
    )
  }

export const tryParse =
  <Carrier>(validUnits: readonly string[], syntax: Expression<Carrier>) =>
  (input: string): ParseResult<Carrier> => {
    const { word, index } = stripWhiteSpace(input, 0)
    return parseValue<Carrier>([])({ validUnits, syntax }, { word, index })
  }

const parse =
  <Carrier>(validUnits: readonly string[], syntax: Expression<Carrier>) =>
  (input: string): Carrier => {
    const result = tryParse(validUnits, syntax)(input)
    if (result.type === 'ParseResultError') {
      throw new Error(`Parse error at position ${result.state.index}: ${result.message}`)
    }
    return result.data
  }

export default parse
