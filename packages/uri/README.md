@stackmeister/uri
=====================

A small set of URI utility functions.

Install
=======

```bash
// Yarn
yarn add @stackmeister/uri

// NPM
npm i @stackmeister/uri
```

TypeScript typings are included (No `@types/` package needed)

Usage
=====

```ts
import { parse, stringify, resolve } from '@stackmeister/uri'

const { scheme, userInfo, host, port, path, query, fragment } = parse(
  'https://example.com/some/path?query=test#someFragment'
)


const uri = stringify({ scheme, userInfo, host, port, path, query, fragment })

const fullUri = resolve('https://example.com', '/some/path')
```
