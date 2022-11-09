@stackmeister/json-pointer
==========================

Utilities for JSON-pointers.

Install
=======

```bash
// Yarn
yarn add @stackmeister/json-pointer

// NPM
npm i @stackmeister/json-pointer
```

TypeScript typings are included (No `@types/` package needed)

Usage
=====

```ts
import { get, set, remove } from '@stackmeister/json-pointer'

get('/someProperty/2', { someProperty: ['a', 'b', 'c', 'd'] }) // "c"

set('/a/b', { a: { b: 2 } }, 5) // { a: { b: 5 } }

remove('/a/b', { a: { b: 2, c: 3 } }) // { a: { c: 3 } }
```

