@stackmeister/json-pointer
==============================

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
import { get, set } from '@stackmeister/json-pointer'

const value = get('/someProperty/2', { someProperty: ['a', 'b', 'c', 'd'] }) // "c"

const newValue = set('/a/b', { a: { b: 2 } }, 5) // { a: { b: 5 } }
```
