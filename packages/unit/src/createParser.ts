import type { Unit, Constants, System, Convertible } from './common'
import createConvertible from './createConvertible'
import keys from './keys'

export type Parser<UnitType extends Unit, ConstantsType extends Constants> = <Value extends string>(
  value: Value,
) => Convertible<UnitType, UnitType, ConstantsType>

const createParser = <
  UnitType extends Unit,
  DefaultUnitType extends UnitType,
  ConstantsType extends Constants,
>(
  system: System<UnitType, DefaultUnitType, ConstantsType>,
): Parser<UnitType, ConstantsType> => {
  const units = keys(system.from)
  const parseRegex = new RegExp(`^(-?(?:\\d+|\\.\\d+|\\d+\\.\\d+))(${units.join('|')})?$`)
  return value => {
    const [, valueString, unitString] = value.match(parseRegex) ?? []
    const valueNumber = Number(valueString)
    if (isNaN(valueNumber) || !isFinite(valueNumber)) {
      throw new Error(
        'Failed to parse value [' +
          value +
          '].\nThe unit is probably not registered or your value is not numerical.',
      )
    }
    const unit = (unitString || system.baseUnit) as UnitType
    if (!units.includes(unit)) {
      throw new Error(
        'Failed to parse value with unit [' +
          value +
          ']: Unknown unit ' +
          unit +
          '.\n' +
          "Make sure it's registered in the unit system.",
      )
    }
    return createConvertible(system, valueNumber, unit)
  }
}

export default createParser
