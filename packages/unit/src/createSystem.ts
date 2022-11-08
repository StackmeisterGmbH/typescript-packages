import type { Unit, Constants, System } from './common'

const createSystem = <
  UnitType extends Unit,
  DefaultUnitType extends UnitType,
  ConstantsType extends Constants,
>(
  system: System<UnitType, DefaultUnitType, ConstantsType>,
): System<UnitType, DefaultUnitType, ConstantsType> => system

export default createSystem
