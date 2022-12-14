export type UpdateMessage = {
  readonly type: 'update'
  readonly elapsedTime: number
  readonly deltaTime: number
}
