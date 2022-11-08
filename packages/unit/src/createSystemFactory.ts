import type { Unit, Constants, System } from './common'

const createSystemFactory =
  <UnitType extends Unit, DefaultUnitType extends UnitType, ConstantsType extends Constants>(
    system: System<UnitType, DefaultUnitType, ConstantsType>,
  ) =>
  (constants: Partial<ConstantsType>): System<UnitType, DefaultUnitType, ConstantsType> => ({
    ...system,
    constants: { ...system.constants, ...constants },
  })

export default createSystemFactory
