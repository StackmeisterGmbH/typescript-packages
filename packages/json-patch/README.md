@stackmeister/json-patch
============================

Typing and utilities for working with JSON-Patches

See [RFC-6902](https://datatracker.ietf.org/doc/html/rfc6902) for more information on JSON-Patch documents.

Install
=======

```bash
// Yarn
yarn add @stackmeister/json-patch

// NPM
npm i @stackmeister/json-patch
```

TypeScript typings are included (No `@types/` package needed)

Usage
=====

### Creating patches manually with factories

```ts
import type { JsonPatch } from '@stackmeister/json-patch'
import { add, replace, remove, move, copy, test } from '@stackmeister/json-patch'

const myPatch: JsonPatch = [
  add('/c', 10),
  replace('/b', 5),
  remove('/a'),
  move('/b', '/d'),
  copy('/d', '/e'),
  test('/e', 5),
]
```

### Apply patches to values

```ts
import { applyPatch } from '@stackmeister/json-patch'

const value = { a: 1, b: 2 }
const result = applyPatch(value, myPatch)

// Result:
// { c: 10, d: 5, e: 5 }
```

### Create patches from mutations

```ts
import { createPatch } from '@stackmeister/json-patch'

const value = { id: 1, firstName: '' }
const patch = createPatch(value, draft => {
  draft.firstName = 'John'
  draft.lastName = 'Doe'
  draft.skills = ['js', 'ts']
  draft.skills.push('css')
})

// Patch:
// [
//   { op: 'replace', path: '/firstName', value: 'John' },
//   { op: 'add', path: '/lastName', value: 'Doe' },
//   { op: 'add', path: '/skills', value: ['js', 'ts'] },
//   { op: 'add', path: '/skills/-', value: 'css' },
// ]
```
