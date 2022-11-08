import type { Constants, System, Unit } from '../common'
import createConvertible from '../createConvertible'
import { evaluateExpression } from './helpers'

const createCalculator =
  <UnitType extends Unit, DefaultUnitType extends UnitType, ConstantsType extends Constants>(
    system: System<UnitType, DefaultUnitType, ConstantsType>,
  ) =>
  (strings: TemplateStringsArray, ...values: Array<unknown>) => {
    const stringValue = strings.reduce(
      (result, string, index) =>
        result + string + (values[index] !== undefined ? String(values[index]) : ''),
      '',
    )
    const value = evaluateExpression(system, stringValue)
    return createConvertible<UnitType, UnitType, DefaultUnitType, ConstantsType>(
      system,
      value,
      system.baseUnit,
    )
  }

export type Calc = ReturnType<typeof createCalculator>

export default createCalculator
