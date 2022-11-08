@stackmeister/react-use-merged-ref
======================================

Got multiple refs from hooks or own `useRef` calls, but you can only pass one to an element?

This library can merge multiple refs of the same type into one.

Usage
=====

### Basic Usage


```tsx
import useMergedRef from '@stackmeister/react-use-merged-ref'

const App = () => {
  const scrollingRef = useScrolling()
  const { ref: touchRef } = useTouchControls()
  const { calc, ref: calcRef } = useCalc()
  const ref = useMergedRef(scrollingRef, touchRef, calcRef)

  return (
    <div ref={ref}>
      Hello World!
    </div>
  )
}
```

### Easy to encapsulate

```tsx
import useMergedRef from '@stackmeister/react-use-merged-ref'

const useAppThings = () => {
  const scrollingRef = useScrolling()
  const { ref: touchRef } = useTouchControls()
  const { calc, ref: calcRef } = useCalc()

  return {
    calc,
    ref: useMergedRef(scrollingRef, touchRef, calcRef)
  }
}

const App = () => {
  const { calc, ref } = useAppThings()

  return (
    <div ref={ref}>
      Hello World!
    </div>
  )
}
```
