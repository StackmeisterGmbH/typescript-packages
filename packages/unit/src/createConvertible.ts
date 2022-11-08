import type { Unit, Constants, System, Convertible } from './common'
import keys from './keys'

const createConvertible = <
  UnitType extends AllUnitTypes,
  AllUnitTypes extends Unit,
  DefaultUnitType extends AllUnitTypes,
  ConstantsType extends Constants,
>(
  system: System<AllUnitTypes, DefaultUnitType, ConstantsType>,
  value: number,
  unit: AllUnitTypes,
): Convertible<UnitType, AllUnitTypes, ConstantsType> => {
  const convertible: Convertible<UnitType, AllUnitTypes, ConstantsType> = {
    value,
    unit,
    with: constants => {
      const newConstants = { ...system.constants, ...constants }
      return createConvertible({ ...system, constants: newConstants }, value, unit)
    },
    toSystem: <
      CommonUnitType extends Extract<AllUnitTypes, TargetUnitType>,
      TargetUnitType extends Unit,
      TargetDefaultUnitType extends TargetUnitType,
      TargetConstantsType extends Constants,
    >(
      targetSystem: System<TargetUnitType, TargetDefaultUnitType, TargetConstantsType>,
      commonUnit: CommonUnitType,
    ) => {
      const commonValue = convertible[commonUnit].value
      return createConvertible<
        CommonUnitType,
        TargetUnitType,
        TargetDefaultUnitType,
        TargetConstantsType
      >(targetSystem, commonValue, commonUnit)
    },
    toString: () => `${value}${unit}`,
  } as Convertible<UnitType, AllUnitTypes, ConstantsType>
  const units = keys(system.to)
  Object.defineProperties(
    convertible,
    Object.fromEntries(
      units.map(targetUnit => [
        targetUnit,
        {
          get: () => {
            if (targetUnit === unit) {
              return convertible
            }
            // Convert from unit to baseUnit
            const baseValue = system.from[unit](value, system.constants)
            if (targetUnit === system.baseUnit) {
              return createConvertible(system, baseValue, system.baseUnit)
            }

            // convert from baseUnit to targetUnit
            const targetValue = system.to[targetUnit](baseValue, system.constants)
            return createConvertible(system, targetValue, targetUnit)
          },
        },
      ]),
    ),
  )
  return convertible
}

export default createConvertible
