@stackmeister/openapi
==========================

Typing and utilities for OpenAPI, mostly focused on 3.x versions.

Install
=======

```bash
// Yarn
yarn add @stackmeister/openapi

// NPM
npm i @stackmeister/openapi
```

TypeScript typings are included (No `@types/` package needed)

Usage
=====

This library consists of types, mostly. Soon there will also be factories.

```ts
import type { Document } from '@stackmeister/openapi'

const spec: Document = {
  openapi: '3.0',
  info: {
    // From here on, just follow auto-completion
  }
}
```

For every structure that exists in the OpenAPI 3 spec, there will be a fitting type in here, including complex schema typing
through `@stackmeister/json-schema`
