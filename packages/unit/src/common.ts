export type Unit = string

export type Constants = Readonly<Record<string, unknown>>

export type Conversion<ConstantsType extends Constants> = (
  value: number,
  constants: ConstantsType,
) => number

export type System<
  UnitType extends Unit, // covariant
  BaseUnitType extends UnitType, // covariant
  ConstantsType extends Constants, // invariant
> = {
  readonly constants: ConstantsType
  readonly baseUnit: BaseUnitType
  readonly to: Record<UnitType, Conversion<ConstantsType>>
  readonly from: Record<UnitType, Conversion<ConstantsType>>
}
export type SystemTop = System<Unit, Unit, any>

export type ValueWithUnit<Value extends number, UnitType extends Unit> = {
  readonly value: Value
  readonly unit: UnitType
  readonly toString: () => string
}

export type Convertible<
  UnitType extends AllUnitTypes,
  AllUnitTypes extends Unit,
  ConstantsType extends Constants,
> = ValueWithUnit<number, UnitType> & {
  readonly [TargetUnitType in AllUnitTypes]: Convertible<
    TargetUnitType,
    AllUnitTypes,
    ConstantsType
  >
} & {
  readonly with: (
    constants: Partial<ConstantsType>,
  ) => Convertible<UnitType, AllUnitTypes, ConstantsType>
  readonly toSystem: <
    CommonUnitType extends Extract<AllUnitTypes, TargetUnitType>,
    TargetUnitType extends Unit,
    TargetDefaultUnitType extends TargetUnitType,
    TargetConstantsType extends Constants,
  >(
    system: System<TargetUnitType, TargetDefaultUnitType, TargetConstantsType>,
    commonUnit: CommonUnitType,
  ) => Convertible<CommonUnitType, TargetUnitType, TargetConstantsType>
}
