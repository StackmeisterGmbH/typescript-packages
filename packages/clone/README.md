@stackmeister/clone
=======================

Deep cloning utility that properly transforms references.

Usage
=====

```ts
import clone from '@stackmeister/clone'

const a = { a: [1, 2, 3] }
const b = clone(a)

a === b      // false
equals(a, b) // true
```
