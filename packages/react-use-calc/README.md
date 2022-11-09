@stackmeister/react-use-calc
============================

Provides a CSS-like `calc`-function in React with support for all CSS units.

Install
=======

```bash
// Yarn
yarn add @stackmeister/react-use-calc

// NPM
npm i @stackmeister/react-use-calc
```

TypeScript typings are included (No `@types/` package needed)

Usage
=====

### Normal usage

```tsx
import useCalc from '@stackmeister/react-use-calc'

const App = () => {
  const { calc } = useCalc()

  return (
    <div style={{ width: calc`100vw - 12px` }}>
      Hello World!
    </div>
  )
}
```

### With a reference element

With a reference element, units like `em` and `%` will be bound to the referenced element.

```tsx
import useCalc from '@stackmeister/react-use-calc'

const App = () => {
  const { calc, ref } = useCalc()

  return (
    <div ref={ref}>
      <div style={{ height: calc`50% - 2em` }}>
        Hello World!
      </div>
    </div>
  )
}
```
