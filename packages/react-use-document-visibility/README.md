@stackmeister/react-use-document-visibility
===============================================

A hook that checks if a screen is currently rendered by its system or not.

Mostly relies on `document.hidden` and the `visibilitychange` event.

This hook can help with **green coding**, to stop animations and heavy stuff when the
app is not currently on top or rendered.

Usage
=====

```tsx
import useDocumentVisibility from '@stackmeister/react-use-document-visibility'

const App = () => {
  const { visible } = useDocumentVisibility()

  return (
    <div>
      {visible && <HeavyComponent />}
    </div>
  )
}
```
