import type { FC } from 'react'

export type ComponentHook<Props> = (params: never) => readonly [
  props: {
    readonly [PropKey in keyof Props]?: Props[PropKey]
  },
  handles: unknown,
]

const defineComponent =
  <Props>(component: FC<Props>) =>
  <Hook extends ComponentHook<Props>>(hook: Hook): readonly [component: FC<Props>, hook: Hook] =>
    [component, hook]

export default defineComponent
