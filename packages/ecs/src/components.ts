export type Component<Props, Messages> = {
  readonly id: symbol
  readonly name: string

  readonly initialProps: Props

  readonly onMessage: (message: Messages) => void
}

export type ComponentProps<ComponentType extends Component<unknown, unknown>> =
  ComponentType['initialProps']

export type ComponentMessages<ComponentType extends Component<unknown, unknown>> = Parameters<
  ComponentType['onMessage']
>[0]

export type ComponentWithPropsTuple<Props> = readonly [Component<Props, unknown>, Props]

export const createComponent = <Props, Messages>(component: Component<Props, Messages>) => component
