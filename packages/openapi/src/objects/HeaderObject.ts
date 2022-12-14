import type ParameterObject from './ParameterObject'

type HeaderObject = Omit<ParameterObject, 'name' | 'in' | 'allowReserved'>

export default HeaderObject
