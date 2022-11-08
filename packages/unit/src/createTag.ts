import type { Unit, Constants, System, Convertible } from './common'
import createParser from './createParser'

const createTag = <
  UnitType extends Unit,
  DefaultUnitType extends UnitType,
  ConstantsType extends Constants,
>(
  system: System<UnitType, DefaultUnitType, ConstantsType>,
) => {
  const parse = createParser(system)
  return (
    strings: TemplateStringsArray,
    ...values: Array<unknown>
  ): Convertible<UnitType, UnitType, ConstantsType> => {
    const stringValue = strings.reduce(
      (result, string, index) =>
        result + string + (values[index] !== undefined ? String(values[index]) : ''),
      '',
    )
    return parse(stringValue)
  }
}

export default createTag
