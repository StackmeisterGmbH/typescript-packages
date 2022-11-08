@stackmeister/react-reduce-context
======================================

Poor mans redux.

Whenever Redux feels like too much for now.

Install
=======

```bash
// Yarn
yarn add @stackmeister/react-reduce-context

// NPM
npm i @stackmeister/react-reduce-context
```

TypeScript typings are included (No `@types/` package needed)

Usage
=====

### Basic usage

Create a store slice. This is a completely isolated module.

```tsx
// utils/counter.js
import { createReduceContext } from '@stackmeister/react-reduce-context'

const { useContext, Provider } = createReduceContext({
  // The initial state of the store slice
  initialState: {
    counter: 0,
    loading: false,
  },

  // The reducer (Same as what you pass to useReducer)
  reduce: (state, action) => {
    switch (action.type) {
      case 'reset': {
        return {
          ...state,
          counter: 0,
        }
      }
      case 'set': {
        return {
          ...state,
          counter: action.value,
        }
      }
      case 'increase': {
        return {
          ...state,
          counter: state.counter + action.amount,
        }
      }
      case 'decrease': {
        return {
          ...state,
          counter: state.counter - action.amount,
        }
      }
      case 'startLoading': {
        return {
          ...state,
          loading: true,
        }
      }
      case 'finishLoading': {
        return {
          ...state,
          counter: action.value,
          loading: false,
        }
      }
    }
  },

  // Action dispatchers
  //   Short way to trigger actions in your reducer
  //   Gets the dispatcher as the first argument
  //   Can have abitrary parameters after that
  dispatchers: {
    reset: dispatch => {
      dispatch({ type: 'reset' })
    },
    set: (dispatch, amount) => {
      dispatch({ type: 'set' })
    },
    increase: (dispatch, amount) => {
      dispatch({ type: 'increase', amount })
    },
    decrease: (dispatch, amount) => {
      dispatch({ type: 'decrease', amount })
    },
    // Async by nature (You can wait for it in effects etc.)
    fetchValue: async dispatch => {
      dispatch({ type: 'startLoading' })
      const value = await new Promise(resolve => {
        setTimeout(() => resolve(1337), 2000)
      })
      dispatch({ type: 'finishLoading', value })
    },
  }

  // Methods
  //   Helper utilities that can work with the current state
  //   Gets the state as the first argument and all dispatchers as the second
  //   Can have abitrary parameters after that
  methods: {
    double: (state, { set }) => {
      set(state.counter * 2)
    },
    
    pow: (state, { set }, exponent) => {
      set(Math.pow(state.counter, exponent))
    }
  },

  // Getters
  //  Computed values that will update whenever the state changes
  //  For more sophisticated computed properties rather stick to useMemo() inside components
  getters: {
    counterTimesTwo: state => {
      return state.counter * 2
    }
  },
})

// Export it as whatever you like
export const useCounter = useContext
export const CounterProvider = Provider
```

Use it

```tsx
// Counter.ts

import { useCounter, CounterProvider } from './utils/counter'

const Counter = () => {
  const {
    // Gets the full state of the slice (e.g. "{ counter: 0 }")
    state,
  
    // Dispatchers, Methods and Getters are merged
    increase,
    fetchValue,

    pow,

    counterTimesTwo,
  } = useCounter()

  return (
    <div>
      Counter value: {{ state.counter }}

      {state.loading && <span>Counter is loading...</span>}

      {/* Call dispatchers */}
      <button onClick={() => increase(1)}>Increase by 1</button>
      <button onClick={() => increase(5)}>Increase by 5</button>
      <button onClick={() => fetchValue()}>Fetch external</button>

      {/* Call methods */}
      <button onClick={() => pow(2)}>Double</button>

      {/* Retrieve getters */}
      Counter times two: {{ counterTimesTwo }}
    </div>
  )
}

const App = () => {
  return (
    <CounterProvider>
      <Counter />
    </CounterProvider>
  )
}

render(<App />, document.getElementById('root'))
```

### Compose multiple slices

Combination of two slices of state right now is rather manual, but works well.
With some utilities added to this library it can be easily supported, but
existing concepts are not fleshed out well enough yet.

```tsx
// state/users.tsx

export default {
  initialState: {
    list: [],
    loading: false,
  },

  reduce: reduceUsers,

  dispatchers: {
    loadUsers: async dispatch => {
      dispatch({ type: 'startLoading' })
      const users = await fetchUsersFromApi()
      dispatch({ type: 'finishLoading', users })
    }
  }
}
```

```tsx
// state/groups.tsx

export default {
  initialState: {
    list: [],
    loading: false,
  },

  reduce: reduceGroups,

  dispatchers: {
    loadGroups: async dispatch => {
      dispatch({ type: 'startLoading' })
      const groups = await fetchGroupsFromApi()
      dispatch({ type: 'finishLoading', groups })
    }
  }
}
```

```tsx
// state/app.tsx

import users from './state/users'
import groups from './state/groups'

// Bundle all modules
const modules = { users, groups }

// Creates an object
//  { users: users.initialState, groups: groups.initialState, ... } 
//   from "modules"
const initialState = Object.fromEntries(
  Object.entries(modules)
    .map(([key, module]) => [key, module.initialState])
)

// Creates an object
//  { users: users.reduce, groups: groups.reduce, ... }
//  from "modules"
const reducers = Object.fromEntries(
  Object.entries(modules)
    .map(([key, module]) => [key, module.reduce])
)

// The main, root reducer that will just
//   dispatch the action on slice of itself
//     "action" will always be of type
//       { key: string, action: Action }
//     where "key" is the sub-module (e.g. "users", "groups")
//     and "action" is the sub-action to dispatch in that submodule
const reduce = (state, action) => {
  return {
    ...state,
    [action.key]: reducers[action.key](action.action),
  }
}

// A helper function that will wrap all dispatchers
//   e.g. users.dispatchers.loadUsers(dispatch)
//   will be turned into
//   users.dispatchers.loadUsers(action => dispatch({ key: 'users', action }))
//   Right now this library doesn't provide that functionality.
const wrapDispatchers = (key, dispatchers) =>
  Object.fromEntries(
    Object.entries(dispatchers)
      .map(([key, dispatcher]) =>
        // Make sure to properly translate the variadic args with ...args
        [key, (dispatch, ...args) => dispatcher(action => dispatch({ key, action }), ...args)]
      )
  )

// Creates an array
//  [wrapDispatchers('users', users.dispatchers), wrapDispatchers('groups', groups.dispatchers)]
//  from "modules"
const dispatchersList = Object.entries(modules)
    .map(([key, dispatchers]) => wrapDispatchers(key. dispatchers))

// Merge all wrapped dispatchers into a single object
const dispatchers = Object.assign({}, ...dispatchersList)

// !!Notice!!
// something similar as with the dispatchers (but not the exact same!) has to be done for "methods" and "getters", if you need them


// Finally construct the whole thing
const { useContext, Provider } = createReduceContext({
  initialState,
  reduce,
  dispatchers,
})

export const useAppState = useContext
export const AppStateProvider = Provider
```

And this is how you would use it inside a component:

```tsx
const { state: { users }, loadUsers } = useAppState() // needs to be wrapped by "AppStateProvider" of course

useEffect(() => {
  loadUsers()
}, [])

return (
  <div>
    {users.loading && <div>Users are loading currently...</div>}
    {users.items.map(user => (
      <UserCard key={user.id} user={user} />
    ))}
  </div>
)
```

Of course, other sophisticated and more complex setups are possible, e.g.
dispatchers grouped by their module key so that they don't overlap etc.

Exactly because of this there is no fixed solution implemented for
composed modules right now, but its still possible to construct
such a system with the building blocks provided by this library.
