@stackmeister/class-names
=====================

CSS class concatenation utility

Usage
=====

```ts
import classNames from '@stackmeister/class-names'

classNames('btn') // "btn"
classNames('btn', 'btn-primary') // "btn btn-primary"
classNames('btn', disabled && 'btn-disabled') // "btn" or "btn btn-disabled"
classNames('btn', submit ? 'btn-submit' : 'btn-default') // "btn btn-submit" or "btn btn-default"
```
