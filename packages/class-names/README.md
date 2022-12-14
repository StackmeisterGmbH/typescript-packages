@stackmeister/class-names
=========================

A class name concatenation utility for UI building.

Install
=======

```bash
// Yarn
yarn add @stackmeister/class-names

// NPM
npm i @stackmeister/class-names
```

TypeScript typings are included (No `@types/` package needed)

Usage
=====

```ts
import classNames from '@stackmeister/class-names'

classNames('btn') // "btn"
classNames('btn', 'btn-primary') // "btn btn-primary"
classNames('btn', disabled && 'btn-disabled') // "btn" or "btn btn-disabled"
classNames('btn', submit ? 'btn-submit' : 'btn-default') // "btn btn-submit" or "btn btn-default"
```
