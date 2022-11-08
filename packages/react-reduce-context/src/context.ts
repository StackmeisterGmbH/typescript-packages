import type { Dispatch, PropsWithChildren, Reducer } from 'react'
import { createContext, createElement, useContext, useMemo, useReducer } from 'react'

type OmitFirstParameter<Func extends Function> = Func extends (...args: [any, ...infer Rest]) => any
  ? Rest
  : never

type OmitFirstTwoParameters<Func extends Function> = Func extends (
  ...args: [any, any, ...infer Rest]
) => any
  ? Rest
  : never

export type ReduceGetters<State> = Record<string, (state: State) => any>
export type ReduceDispatchers<Action> = Record<
  string,
  (dispatch: Dispatch<Action>, ...args: any[]) => any
>
export type ReduceMethods<State, Action> = Record<
  string,
  (
    state: State,
    dispatchers: ReduceContextValueDispatchers<Action, ReduceDispatchers<Action>>,
    ...args: any[]
  ) => any
>

export type ReduceContextValueGetters<State, Getters extends ReduceGetters<State>> = {
  readonly [Name in keyof Getters]: ReturnType<Getters[Name]>
}

export type ReduceContextValueDispatchers<Action, Dispatchers extends ReduceDispatchers<Action>> = {
  readonly [Name in keyof Dispatchers]: (
    ...args: OmitFirstParameter<Dispatchers[Name]>
  ) => ReturnType<Dispatchers[Name]>
}

export type ReduceContextValueMethods<
  State,
  Action,
  Methods extends ReduceMethods<State, Action>,
> = {
  readonly [Name in keyof Methods]: (
    ...args: OmitFirstTwoParameters<Methods[Name]>
  ) => ReturnType<Methods[Name]>
}

export type ReduceContextValue<
  State,
  Action,
  Getters extends ReduceGetters<State>,
  Dispatchers extends ReduceDispatchers<Action>,
  Methods extends ReduceMethods<State, Action>,
> = ReduceContextValueGetters<State, Getters> &
  ReduceContextValueDispatchers<Action, Dispatchers> &
  ReduceContextValueMethods<State, Action, Methods> & {
    readonly state: State
    readonly dispatch: Dispatch<Action>
  }

export type CreateReduceContextOptions<
  State,
  Action,
  Getters extends ReduceGetters<State>,
  Dispatchers extends ReduceDispatchers<Action>,
  Methods extends ReduceMethods<State, Action>,
> = {
  readonly initialState: State
  readonly reduce: Reducer<State, Action>
  readonly displayName?: string
  readonly getters?: Getters
  readonly dispatchers?: Dispatchers
  readonly methods?: Methods
}

export type ReduceProviderProps<State> = {
  readonly initialState?: State
}

export type ReduceContext<
  State,
  Action,
  Getters extends ReduceGetters<State>,
  Dispatchers extends ReduceDispatchers<Action>,
  Methods extends ReduceMethods<State, Action>,
> = {
  readonly Provider: (props: PropsWithChildren<ReduceProviderProps<State>>) => JSX.Element
  readonly useContext: () => ReduceContextValue<State, Action, Getters, Dispatchers, Methods>
}

export const createReduceContext = <
  State,
  Action,
  Getters extends ReduceGetters<State>,
  Dispatchers extends ReduceDispatchers<Action>,
  Methods extends ReduceMethods<State, Action>,
>(
  options: CreateReduceContextOptions<State, Action, Getters, Dispatchers, Methods>,
): ReduceContext<State, Action, Getters, Dispatchers, Methods> => {
  const getterEntries = Object.entries(options.getters ?? {})
  const dispatcherEntries = Object.entries(options.dispatchers ?? {})
  const methodEntries = Object.entries(options.methods ?? {})

  const Context = createContext<
    ReduceContextValue<State, Action, Getters, Dispatchers, Methods> | undefined
  >(undefined)
  Context.displayName = options.displayName

  const createGetters = (state: State): ReduceContextValueGetters<State, Getters> => {
    return getterEntries.reduce((getters, [name, get]) => {
      return {
        ...getters,
        get [name]() {
          return get(state)
        },
      }
    }, {} as Record<string, (...args: any[]) => any>) as unknown as ReduceContextValueGetters<
      State,
      Getters
    >
  }

  const createDispatchers = (
    dispatch: Dispatch<Action>,
  ): ReduceContextValueDispatchers<Action, Dispatchers> => {
    return Object.fromEntries(
      dispatcherEntries.map(([name, createAction]) => {
        return [name, (...args: unknown[]): unknown => createAction(dispatch, ...args)]
      }),
    ) as unknown as ReduceContextValueDispatchers<Action, Dispatchers>
  }

  const createMethods = (
    state: State,
    dispatchers: ReduceContextValueDispatchers<Action, Dispatchers>,
  ): ReduceContextValueMethods<State, Action, Methods> => {
    return Object.fromEntries(
      methodEntries.map(([name, call]) => {
        return [name, (...args: unknown[]): unknown => call(state, dispatchers, ...args)]
      }),
    ) as unknown as ReduceContextValueMethods<State, Action, Methods>
  }

  const Provider = ({
    initialState,
    children,
  }: PropsWithChildren<ReduceProviderProps<State>>): JSX.Element => {
    const [state, dispatch] = useReducer(options.reduce, initialState ?? options.initialState)
    const getters = useMemo(() => createGetters(state), [state])
    const dispatchers = useMemo(() => createDispatchers(dispatch), [dispatch])
    const methods = useMemo(() => createMethods(state, dispatchers), [state, dispatchers])
    const value: ReduceContextValue<State, Action, Getters, Dispatchers, Methods> = useMemo(
      () => ({
        state,
        dispatch,
        ...getters,
        ...dispatchers,
        ...methods,
      }),
      [state, dispatch, dispatchers, methods],
    )
    return createElement(Context.Provider, { value }, children)
  }

  const useReduceContext = (): ReduceContextValue<State, Action, Getters, Dispatchers, Methods> => {
    const value = useContext(Context)
    if (value === undefined) {
      throw new Error(
        `Failed to get context: Context value is undefined. Maybe you forgot to wrap the Provider around the element?`,
      )
    }
    return value
  }

  return {
    Provider,
    useContext: useReduceContext,
  }
}
