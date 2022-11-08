@stackmeister/react-overlay
===============================

Utility for easily overlaying elements over the whole app in React.

It helps elements deep inside the DOM to break out of it
and avoid z-index fuckery when creating modals, dialogs, tooltips,
tutorial markers etc.

It is using React Portals, some DOM-manipulation, but no CSS. Positioning
etc. is up to your app. The OverlayPortal will just help you to break
out of the DOM.

Install
=======

```bash
// Yarn
yarn add @stackmeister/react-overlay

// NPM
npm i @stackmeister/react-overlay
```

TypeScript typings are included (No `@types/` package needed)

Usage
=====

```tsx
import { OverlayPortal } from '@stackmeister/react-overlay'
import { useState } from 'react'
import { render } from 'react-dom'

const App = () => {
  const [open, setOpen] = useState(false)

  return (
    <div class="app">
      <button type="button" onClick={() => setOpen(true)}>
        Open Overlay
      </button>

      {open && (
        <OverlayPortal>
          <div className="modal" style={{ position: 'absolute', top: 100, left: 100 }}>
            This will overlay everything by default

            <button type="button" onClick={() => setOpen(false)}>
              Close Overlay
            </button>
          </div>
        </OverlayPortal>
      )}
    </div>
  )
}

render(<App />, rootElement)
```
