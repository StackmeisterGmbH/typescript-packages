@stackmeister/color
===================

Color conversion and manipulation toolbelt.

Install
=======

```bash
// Yarn
yarn add @stackmeister/color

// NPM
npm i @stackmeister/color
```

TypeScript typings are included (No `@types/` package needed)

Usage
=====

Notice many features are not documented yet.

### Parsing colors

```ts
import { parse } from '@stackmeister/color'

const red = parse('red') // { space: 'rgb', data: [255, 0, 0] }
const blue = parse('#00f') // { space: 'rgb', data: [0, 0, 255] }
const green = parse('rgb(0, 255, 0)') // { space: 'rgb', data: [0, 255, 0] }
```

Supported syntaxes:
- Color names (extensive list of over 600 known colors)
- Hex codes (short and long)
- Function syntax (rgb, rgba, hsl, hsla)

### Manipulating colors

Check auto-completion for full capabilities for now

```ts
const darkRed = red.darken(.5)
```
