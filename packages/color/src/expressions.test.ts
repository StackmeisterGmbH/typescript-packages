import { toFunctionArg, toFunctionExpression, trimZeroes } from './expressions'
import { hsl, hsla } from './hsl'
import { rgb, rgba } from './rgb'

describe('toFunctionExpression', () => {
  ;(
    [
      [rgb(0, 0, 0), 'rgb(0,0,0)'],
      [rgb(255, 255, 255), 'rgb(255,255,255)'],
      [rgba(0, 0, 0, 0.5), 'rgba(0,0,0,0.5)'],
      [rgba(255, 255, 255, 0.5), 'rgba(255,255,255,0.5)'],
      [hsl(180, 0.5, 0.4), 'hsl(180,50%,40%)'],
      [hsla(180, 0.5, 0.4, 0.5), 'hsla(180,50%,40%,0.5)'],
    ] as const
  ).forEach(([color, expected]) => {
    it(`should return ${expected} for ${color}`, () => {
      expect(toFunctionExpression(color)).toBe(expected)
    })
  })
})

describe('trimZeroes', () => {
  ;(
    [
      ['0', '0'],
      ['1', '1'],
      ['10', '10'],
      ['10.0', '10'],
      ['10.00', '10'],
      ['10.000', '10'],
      ['100', '100'],
      ['100.0', '100'],
      ['100.00', '100'],
      ['100.000', '100'],
      ['1.0', '1'],
      ['1.10', '1.1'],
      ['0.0', '0'],
      ['0.00', '0'],
      ['0.000', '0'],
      ['0.0000', '0'],
      ['0.00000', '0'],
      ['0.10000', '0.1'],
      ['0.64100', '0.641'],
      ['0.641', '0.641'],
    ] as const
  ).forEach(([input, expected]) => {
    it(`should return ${expected} for ${input}`, () => {
      expect(trimZeroes(input)).toBe(expected)
    })
  })
})

describe('toFunctionArg', () => {
  ;(
    [
      [1, 'float', 1, 'percent', '100%'],
      [0.43532, 'float', 1, 'percent', '43.532%'],
      [0.5, 'float', 1, 'percent', '50%'],
      [50, 'int', 100, 'percent', '50%'],
      [50, 'int', 50, 'fixed', '50'],
      [0.5, 'int', 0.5, 'fixed', '1'],
      [0.75, 'int', 2, 'fixed', '1'],
      [0.75, 'float', 2, 'fixed', '0.75'],
      [1, 'float', 2, 'fixed', '1'],
    ] as const
  ).forEach(([value, type, scale, unit, expected]) => {
    it(`should return ${expected} for parameters ${value}, ${type}, ${scale}, ${unit}`, () => {
      expect(toFunctionArg(value, type, scale, unit)).toBe(expected)
    })
  })
})
