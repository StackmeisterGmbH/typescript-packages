@stackmeister/clone
===================

Deep cloning utility.

Supports reference integrity. Can clone circular structures.

It won't keep object identity, only for arrays.

Install
=======

```bash
// Yarn
yarn add @stackmeister/clone

// NPM
npm i @stackmeister/clone
```

TypeScript typings are included (No `@types/` package needed)

Usage
=====

```ts
import clone from '@stackmeister/clone'
import equals from '@stackmeister/equals'

const a = { a: [1, 2, 3] }
const b = clone(a)

a === b      // false
equals(a, b) // true
```
