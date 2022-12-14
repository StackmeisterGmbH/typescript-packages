@stackmeister/equals
====================

A small function to check for deep, strict and structural equality.

Install
=======

```bash
// Yarn
yarn add @stackmeister/equals

// NPM
npm i @stackmeister/equals
```

TypeScript typings are included (No `@types/` package needed)

Usage
=====

```ts
import equals from '@stackmeister/equals'

equals(1, 2) // false
equals(1, 1) // true

equals({ a: 1 }, { a: 2 }) // false
equals({ a: 1 }, { a: 1 }) // true

// Require exact property order
equals({ a: 1, b: 2 }, { b: 2, a: 1 }) // true
equals({ a: 1, b: 2 }, { b: 2, a: 1 }, { propertyOrder: 'exact' }) // false
```
