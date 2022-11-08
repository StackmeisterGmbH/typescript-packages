@stackmeister/types
=======================

Minimalistic and strict utility functions for JavaScript's primitive types.

Install
=======

```bash
// Yarn
yarn add @stackmeister/types

// NPM
npm i @stackmeister/types
```

TypeScript typings are included (No `@types/` package needed)

Usage
=====

#### Predicates for simple type checks

```ts
import {
  isUndefined,
  isNull,
  isNullOrUndefined,
  isBoolean,
  isString,
  isNumber,
  isInteger,
  isNumeric,
  isArray,
  isObject,
  isFunction,
} from '@stackmeister/types'

isUndefined('test') // false
isUndefined(undefined) // true
isUndefined(null) // false

isNull('test') // false
isNull(null) // true
isNull(undefined) // false

// etc...
```

> Notice: In the Stackmeister typing mindset, objects and arrays are two very different things
>         An object will not be an object, when it is an array. It will only match the `isArray` predicate.