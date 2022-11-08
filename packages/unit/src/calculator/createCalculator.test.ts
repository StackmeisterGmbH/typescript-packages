import createCalculator from './createCalculator'
import lengthSystem from '../systems/lengthSystem'
import amountOfSubstanceSystem from '../systems/amountOfSubstanceSystem'
import temperatureSystem from '../systems/temperatureSystem'
import timeSystem from '../systems/timeSystem'
import createSystem from '../createSystem'

const calc = createCalculator(lengthSystem)
const calcSubst = createCalculator(amountOfSubstanceSystem)
const calcTemp = createCalculator(temperatureSystem)
const calcTime = createCalculator(timeSystem)

const customSystem = createSystem({
  baseUnit: 'flux',
  constants: {
    theAnswerToEverything: 42.42,
  },
  from: {
    flux: value => value,
    foo: (value, { theAnswerToEverything }) => value * theAnswerToEverything,
  },
  to: {
    flux: value => value,
    foo: (value, { theAnswerToEverything }) => value / theAnswerToEverything,
  },
})

const calcCustom = createCalculator(customSystem)

describe('createCalculator', () => {
  it(`should correctly parse syntax gracefully`, () => {
    expect(calc`15m *18km`.toString()).toBe('270000m')
    expect(calc`1m + 100cm* 2- 1m`.toString()).toBe('2m')
    expect(calc`2km`.toString()).toBe('2000m')
    expect(calc`.2km`.toString()).toBe('200m')
    expect(calc`.2km + .1km`.toString()).toBe('300m')
    expect(calc`12km - 200m`.cm.toString()).toBe('1180000cm')
    expect(calcSubst`12mol - 100mmol`.toString()).toBe('11.9mol')
    expect(calcTemp`12K - 100°C`.toString()).toBe('-361.15K')
    expect(calcTime`12w - 13d`.d.toString()).toBe('71d')
    expect(calcCustom`12flux * 2foo`.toString()).toBe('1018.08flux')
  })

  it(`should correctly handle precedence`, () => {
    expect(calc`2 * 3 + 4`.toString()).toBe('10m')
    expect(calc`2 * 3 + 4 * 3 * (4 + 2)`.toString()).toBe('78m')
    expect(calc`2 * 3 + 2 + 1 + 4 * 3 * (4 + 2) + 1`.toString()).toBe('82m')
    expect(calc`2 + 3 * 4`.toString()).toBe('14m')
    expect(calc`2 + 8 / 4`.toString()).toBe('4m')
    expect(calc`8 / 4 + 2`.toString()).toBe('4m')
    expect(calc`10 - 3 - 2`.toString()).toBe('5m')
  })

  it(`should correctly handle negatives`, () => {
    expect(calc`-2 * -2m`.toString()).toBe('4m')
    expect(calc`-2 * 2m`.toString()).toBe('-4m')
    expect(calc`2 * -2m`.toString()).toBe('-4m')
    expect(calc`-2*-2m`.toString()).toBe('4m')
    expect(calc`-2*2m`.toString()).toBe('-4m')
    expect(calc`2*-2m`.toString()).toBe('-4m')
    expect(calc`-2--2m`.toString()).toBe('0m')
    expect(calc`-2-2m`.toString()).toBe('-4m')
    expect(calc`-2+-2m`.toString()).toBe('-4m')
    expect(calc`-2km`.toString()).toBe('-2000m')
  })

  it(`should correctly handle brackets`, () => {
    expect(calc`(1 + 1)`.toString()).toBe('2m')
    expect(calc`2 * (3 + 4)`.toString()).toBe('14m')
    expect(calc`(2 + 3) * 4`.toString()).toBe('20m')
    expect(calc`2 * (2 + 3) * 4`.toString()).toBe('40m')
  })

  it(`should correctly handle function calls`, () => {
    expect(calc`max(120cm, 1m)`.toString()).toBe('1.2m')
    expect(calc`min ( 120cm, 8mm , 1m )`.toString()).toBe('0.008m')
    expect(calc`minmax ( 30mm, 80cm , 1m )`.toString()).toBe('0.8m')
    expect(calc`minmax ( 30mm, 2cm , 1m )`.toString()).toBe('0.03m')
    expect(calc`minmax ( 30mm, 500cm , 1m )`.toString()).toBe('1m')
    expect(calc`max(0, (ceil(-3mm)), mod(12000mm, 500cm), 1)`.toString()).toBe('2m')
    expect(calc`floor(((((160cm)))))`.toString()).toBe('1m')
  })
  ;[
    [')'],
    ['('],
    ['()'],
    ['1 ('],
    ['1 )'],
    ['1 + ('],
    ['1 + )'],
    ['1 + 2)'],
    ['(1 + 2))'],
    ['((1 + 2)'],
    ['(1 + 2) 5'],
    ['(1 + 2) +'],
    ['5 (1 + 2)'],
    ['+ (1 + 2)'],
    ['+ +'],
    ['+-'],
    ['1-'],
    ['1+'],
    ['4-1+'],
    ['+1'],
    ['+0'],
    ['2 3'],
    ['+ 4 2'],
    ['1 + + 1'],
    ['*10m'],
    ['min(1, 2, 3'],
    ['min(1, max(2, 3)'],
    ['min(1, 2, 3,)'],
    ['max((1, 3))'],
    ['floor(1, 3)'],
    ['floor()'],
    ['max()'],
  ].forEach(([input]) => {
    it(`should throw an error for ${input}`, () => {
      expect(() => calc`${input}`).toThrow()
    })
  })
})
