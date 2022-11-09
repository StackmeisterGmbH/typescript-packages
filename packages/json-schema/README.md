@stackmeister/json-schema
=========================

A very clean and lightweight implementation of the [JSON-Schema](https://json-schema.org/) standard.

It provides easy construction of schemas and a full, blazing-fast validator.

Especially for TypeScript users it also provides clean and proper typing for JSON-Schemas.

Install
=======

```bash
// Yarn
yarn add @stackmeister/json-schema

// NPM
npm i @stackmeister/json-schema
```

TypeScript typings are included (No `@types/` package needed)

Usage
=====

### Type a schema

This library comes with a lot of ready-to-use types for common schemas.

For most common use-cases you can fully rely on the `Schema`-type, which
includes all properties known to the JSON-Schema standard.

```ts
import type { Schema } from '@stackmeister/json-schema'

const user: Schema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 5 },
  },
}
```

### Build schemas easily with factories

With a set of factories you can build fully-fledged schemas a lot easier.

We avoid bringing in complex, reference-based builders so that you can use
the factories in functional programming patterns for even smarter and faster
schema creation.

```ts
import { object, string } from '@stackmeister/json-schema'

const user = object({
  properties: {
    email: string({ format: 'email' }),
    password: string({ minLength: 5 }),
  },
  required: ['email'],
})
```

#### Showcasing some factories (find more in the docs)

```ts
// Primitives
import {
  schemaNull,
  boolean,
  string,
  number,
  integer,
  arrayOf,
  objectOf,
  nullable,
} from '@stackmeister/json-schema'

const product = objectOf({
  title: string({ minLength: 5 }),
  description: oneOf(string(), schemaNull()),
  shortDescription: nullable(string()),
  price: number({ minimum: 0, maximum: 1000 }),
  stock: integer({ minimum: 0 }),
  tags: arrayOf(string(), { maxItems: 5 }),
}, { required: ['title', 'price', 'tags'] })
```

#### Composition of schemas

See [the official JSON-Schema docs](https://json-schema.org/understanding-json-schema/reference/combining.html) for
more information.

```ts
import { allOf, anyOf, oneOf, not, ... } from '@stackmeister/json-schema'

allOf(string(), { minLength: 5 }) // { allOf: [{ type: 'string' }, { minLength: 5 }] }
anyOf(string(), number(), schemaNull()) // { anyOf: [{ type: 'string' }, { type: 'number' }, { type: 'null' }]}
oneOf(string(), schemaNull()) // { anyOf: [{ type: 'string' }, { type: 'number' }, { type: 'null' }]}
not(anyOf(string(), number()))
```

#### Schema validation

A complete validator is inbuilt. It is extensive and very configurable, most of which
still needs proper documentation. It is tested intensively and works well, though!

Notice the validator isn't async to maintain fast speeds.
This is why you need to dereference the schema and resolve all `$ref` properties prior
to validating against the schema manually.

This is not done for you so that you can cache the dereferenced schema where needed. After that
point no waiting for IO is involved anymore.

```ts
import type { Schema } from '@stackmeister/json-schema'
import { deref, validateBasic } from '@stackmeister/json-schema'

const schema: Schema = {
  type: 'object',
  properties: {
    address: { ref: 'https://example.com/some-remote-schema.json#address' },
  }
}

const valueToValidate = {
  address: {
    street: 'Abc-Street',
  }
}

deref(schema)
  .then(resolvedSchema => {

    const result = validateBasic(resolvedSchema, valueToValidate) // Not async anymore!
    if (!result.valid) {
      throw new Error(`Validation failed!`)
    }
  })
```

In common SPAs you best `deref()` your validation schemas somewhere accessible and then
re-use it whenever needed. You can also cache fully resolved schemas, but they can
become large and sometimes recursive, so be careful!