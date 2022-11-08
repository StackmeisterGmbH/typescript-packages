@stackmeister
=============

Official TypeScript Monorepo

## Package Overview

| Name | Description | Type | Package | Docs |
|------|-------------|------|---------|------|
| Class Names | Class name builder | Library | [class-names](https://www.npmjs.com/package/@stackmeister/class-names) | [README](https://github.com/StackmeisterGmbH/typescript-packages/blob/main/packages/class-names/README.md) |
| Clone | Deep cloning | Library | [clone](https://github.com/StackmeisterGmbH/typescript-packages/packages/pkgs/npm/clone) | [README](https://github.com/StackmeisterGmbH/typescript-packages/blob/main/packages/clone/README.md) |
| Color | Color manipulation | Library | [color](https://github.com/StackmeisterGmbH/typescript-packages/pkgs/npm/color) | [README](https://github.com/StackmeisterGmbH/typescript-packages/blob/main/packages/color/README.md) |
| Equals | Deep structural equality checking | Library | [equals](https://github.com/StackmeisterGmbH/typescript-packages/pkgs/npm/equals) | [README](https://github.com/StackmeisterGmbH/typescript-packages/blob/main/packages/equals/README.md) |
| JSON-Patch | Types and tools for JSON-Patches | Library | [json-patch](https://www.npmjs.com/package/@stackmeister/json-patch) | [README](https://github.com/StackmeisterGmbH/typescript-packages/blob/main/packages/json-patch/README.md) |
| JSON-Pointer | Types and tools for JSON-Pointers | Library | [json-pointer](https://www.npmjs.com/package/@stackmeister/json-pointer) | [README](https://github.com/StackmeisterGmbH/typescript-packages/blob/main/packages/json-pointer/README.md) |
| JSON-Ref | Types and tools for JSON-Refs | Library | [json-ref](https://www.npmjs.com/package/@stackmeister/json-ref) | [README](https://github.com/StackmeisterGmbH/typescript-packages/blob/main/packages/json-ref/README.md) |
| JSON-Schema | Types and tools for JSON-Schemas | Library | [json-schema](https://www.npmjs.com/package/@stackmeister/json-schema) | [README](https://github.com/StackmeisterGmbH/typescript-packages/blob/main/packages/json-schema/README.md) |
| OpenAPI | Types and tools for OpenAPI | Library | [openapi](https://www.npmjs.com/package/@stackmeister/openapi) | [README](https://github.com/StackmeisterGmbH/typescript-packages/blob/main/packages/openapi/README.md) |
| React Overlay | Base component for overlays of any kind | React Library | [react-overlay](https://www.npmjs.com/package/@stackmeister/react-overlay) | [README](https://github.com/StackmeisterGmbH/typescript-packages/blob/main/packages/react-overlay/README.md) |
| React Reduce-Context | Poor mans redux | React Library | [react-reduce-context](https://www.npmjs.com/package/@stackmeister/react-reduce-context) | [README](https://github.com/StackmeisterGmbH/typescript-packages/blob/main/packages/react-reduce-context/README.md) |
| React useCalc | Reactive CSS-style `calc` function | React Hook | [react-use-calc](https://www.npmjs.com/package/@stackmeister/react-use-calc) | [README](https://github.com/StackmeisterGmbH/typescript-packages/blob/main/packages/react-use-calc/README.md) |
| React useDocumentVisibility | Reactive green-coding `document.hidden` wrapper | React Hook | [react-use-document-visibility](https://www.npmjs.com/package/@stackmeister/react-use-document-visibility) | [README](https://github.com/StackmeisterGmbH/typescript-packages/blob/main/packages/react-use-document-visibility/README.md) |
| React useIntersectionObserver | Reactive IntersectionObserver wrapper | React Hook | [react-use-intersection-observer](https://www.npmjs.com/package/@stackmeister/react-use-intersection-observer) | [README](https://github.com/StackmeisterGmbH/typescript-packages/blob/main/packages/react-use-intersection-observer/README.md) |
| React useMediaQueryMatch | Reactive CSS-like media queries | React Hook | [react-use-media-query-match](https://www.npmjs.com/package/@stackmeister/react-use-media-query-match) | [README](https://github.com/StackmeisterGmbH/typescript-packages/blob/main/packages/react-use-media-query-match/README.md) |
| React useMergedRef | Merge multiple refs into one | React Hook | [react-use-merged-ref](https://www.npmjs.com/package/@stackmeister/react-use-merged-ref) | [README](https://github.com/StackmeisterGmbH/typescript-packages/blob/main/packages/react-use-merged-ref/README.md) |
| Types | Types and tools for...Types | Library | [types](https://www.npmjs.com/package/@stackmeister/types) | [README](https://github.com/StackmeisterGmbH/typescript-packages/blob/main/packages/types/README.md) |
| Unit | Unit parsing and conversion tools | Library | [unit](https://www.npmjs.com/package/@stackmeister/unit) | [README](https://github.com/StackmeisterGmbH/typescript-packages/blob/main/packages/unit/README.md) |
| URI | Types and tools for URIs and IRIs | Library | [uri](https://www.npmjs.com/package/@stackmeister/json-uri) | [README](https://github.com/StackmeisterGmbH/typescript-packages/blob/main/packages/uri/README.md) |


## Develop

1. Clone and open in IDE
2. Install extensions if possible (e.g. prettier, eslint)
3. Run `$ yarn` (Will install all dependencies and sub-dependencies)
   1. either: build all projects with `$ yarn build:all`
   2. or: build your specific project with `$ yarn nx build @stackmeister/<project-name>`
4. Enter your specific project, e.g. `$ cd packages/uri`
5. Use local mechanisms to develop it, e.g. `$ yarn build`, `$ yarn dev` etc.
   - Add dependencies by running `$ yarn add [package-name]` in a specific projects folder, it will automatically be hoisted in the root folder
6. To release, increase the version in the respective `package.json` (or use `npm version major/minor/patch`) and then push to main


## Tech

- This is an [NX](https://nx.dev/) repository with [Yarn Workspace](https://classic.yarnpkg.com/en/docs/cli/workspaces).
- All sub-projects try to reference root configs if possible, by means of inclusion or extension. All projects share common configuration.
- `rollup.config.js` in the root is a start to create a template/management-system for this repository
