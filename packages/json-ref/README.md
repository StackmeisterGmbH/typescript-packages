@stackmeister/json-ref
==========================

Typing and utilities for working with JSON-Schema Refs (`{ $ref: '' }`)

Install
=======

```bash
// Yarn
yarn add @stackmeister/json-ref

// NPM
npm i @stackmeister/json-ref
```

TypeScript typings are included (No `@types/` package needed)

Usage
=====

### Dereferencing a value

The most important key function of this library is **dereferencing**.

It takes any value and will recursively resolve any JSON-refs found in it.

It supports all common operations regarding `$id` and `$anchor` in the JSON-schema standard.

Notice the input value doesn't have to be a JSON-Schema! Dereferencing can be used on any
JavaScript value freely.

```ts
import type { deref } from '@stackmeister/json-ref'

const user = {
  properties: {
    email: { $ref: '#/$defs/email' },
    password: { type: 'string', minLength: 5 },
  },
  $defs: {
    email: { type: 'string' }
  }
}

const resolvedUser = await deref(user)
```

Resolving external URLs, handling internal ID/Base-URLs via `$id`, internal anchors etc. are all fully supported.

It also comes with proper typing which allows you to cleanly remove refs from a type-definition
once resolved.
