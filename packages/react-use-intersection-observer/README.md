@stackmeister/react-use-intersection-observer
=============================================

A hook that wraps around the DOM IntersectionObserver.

With it you can check things like "for how many percent is this element in that element"
or "am I scrolled half over this element".

Install
=======

```bash
// Yarn
yarn add @stackmeister/react-use-intersection-observer

// NPM
npm i @stackmeister/react-use-intersection-observer
```

TypeScript typings are included (No `@types/` package needed)

Usage
=====

```tsx
import useIntersectionObserver from '@stackmeister/react-use-intersection-observer'

const App = () => {
  const { ref, entry } = useIntersectionObserver()

  // entry =
  // {
  //   boundingClientRect: DOMRect,
  //   intersectionRatio: number,
  //   intersectionRect: DOMRect,
  //   isIntersecting: boolean,
  //   rootBounds: DOMRect,
  //   time: number,
  // }

  return (
    <div ref={ref}>
      ...
    </div>
  )
}
```
