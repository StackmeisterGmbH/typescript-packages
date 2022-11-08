const keys = <Value extends object>(obj: Value): Array<keyof Value> =>
  Object.keys(obj) as Array<keyof Value>
export default keys
