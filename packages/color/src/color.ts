export type Color =
  | { readonly space: 'rgb'; readonly data: [r: number, g: number, b: number] }
  | { readonly space: 'rgba'; readonly data: [r: number, g: number, b: number, a: number] }
  | { readonly space: 'hsl'; readonly data: [h: number, s: number, l: number] }
  | { readonly space: 'hsla'; readonly data: [h: number, s: number, l: number, a: number] }
