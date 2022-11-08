import { isAlpha, withOpacity } from './alpha'
import colors from './colors'
import parse from './parse'
import toString from './toString'

describe('isAlpha', () => {
  ;(
    [
      ['#000', false],
      ['#000000', false],
      ['#fff', false],
      ['#ffffff', false],
      ['rgb(0, 0, 0)', false],
      ['rgba(0, 0, 0, 0)', true],
      ['rgba(0, 0, 0, 1)', true],
      ['rgba(0, 0, 0, 0.5)', true],
      ['rgba(0, 0, 0, 0.99)', true],
      ['rgb(255, 255, 255)', false],
      ['rgba(255, 255, 255, 0)', true],
      ['rgba(255, 255, 255, 1)', true],
      ['rgba(255, 255, 255, 0.5)', true],
      ['rgba(255, 255, 255, 0.99)', true],
      ['hsl(0, 0%, 0%)', false],
      ['hsla(0, 0%, 0%, 0)', true],
      ['hsla(0, 0%, 0%, 1)', true],
      ['hsla(0, 0%, 0%, 0.5)', true],
    ] as const
  ).forEach(([colorString, expected]) => {
    it(`should return ${expected} for ${colorString}`, () => {
      expect(isAlpha(parse(colorString).color)).toBe(expected)
    })
  })
})

describe('withOpacity', () => {
  ;(
    [
      ['#000', 0, 'rgba(0,0,0,0)'],
      ['#fff', 0, 'rgba(255,255,255,0)'],
      ['#fff', 0.5, 'rgba(255,255,255,0.5)'],
      ['#f00', 1, '#f00'],
    ] as const
  ).forEach(([colorString, opacity, expected]) => {
    it(`should return ${expected} for ${colorString} with opacity ${opacity}`, () => {
      expect(toString(withOpacity(opacity, parse(colorString).color))).toBe(expected)
    })
  })

  it('should be able to create shades of Stackmeister colors', () => {
    expect(colors.screenBlue.withOpacity(0.5).toString()).toBe('rgba(29,25,89,0.5)')
    expect(colors.screenBlue.withOpacity(0).toString()).toBe('rgba(29,25,89,0)')
  })
})
