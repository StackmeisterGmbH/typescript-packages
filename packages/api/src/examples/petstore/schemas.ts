import { arrayOf, objectOf } from '@stackmeister/json-schema'

export const Pet = objectOf({
  id: { type: 'integer', format: 'int64' },
  name: { type: 'string' },
  tag: { type: 'string' },
})

export const PetList = arrayOf({ $ref: '#/$defs/Pet' })
