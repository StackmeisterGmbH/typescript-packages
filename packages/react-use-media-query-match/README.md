@stackmeister/react-use-media-query-match
=========================================

Use reactive media queries directly inside React.

Great for reactive, responsive design and responsive DOM changes.

Install
=======

```bash
// Yarn
yarn add @stackmeister/react-use-media-query-match

// NPM
npm i @stackmeister/react-use-media-query-match
```

TypeScript typings are included (No `@types/` package needed)

Usage
=====

```tsx
import useMediaQueryMatch from '@stackmeister/react-use-media-query-match'

const App = () => {
  const matches = useMediaQueryMatch('all and (min-width: 1200px')

  return (
    <div ref={ref}>
      Hello {matches ? 'Desktop!' : 'Mobile!'}!
    </div>
  )
}
```
