import { deref, isRef, ref } from './refs'

describe('ref', () => {
  it('should create a JSON-ref object', () => {
    expect(ref('some-value')).toEqual({ $ref: 'some-value' })
  })
})

describe('isRef', () => {
  it('should check if a value is a valid JSON-ref', () => {
    expect(isRef({ $ref: 'a' })).toEqual(true)
    expect(isRef({ $ref: 'a', b: 0 })).toEqual(true)
  })
})

describe('deref', () => {
  it('dereferences a local schema correctly', () => {
    return deref({
      $defs: { a: { type: 'string' } },
      properties: { a: { $ref: '#/$defs/a' } },
    }).then(value => {
      expect(value).toEqual({
        $defs: { a: { type: 'string' } },
        properties: { a: { type: 'string' } },
      })
      expect(value.$defs.a).toBe(value.properties.a)
    })
  })

  it('dereferences a remote schema correctly', () => {
    return deref({
      properties: {
        anchor: {
          $ref: 'https://raw.githubusercontent.com/json-schema-org/json-schema-spec/2020-12/meta/core.json#/$defs/anchorString',
        },
        idProp: {
          $ref: 'https://raw.githubusercontent.com/json-schema-org/json-schema-spec/2020-12/meta/core.json#/properties/$id',
        },
      },
    }).then(value => {
      expect(value.properties.anchor).toEqual({
        type: 'string',
        pattern: '^[A-Za-z_][-A-Za-z0-9._]*$',
      })
      expect(value.properties.idProp).toEqual({
        type: 'string',
        format: 'uri-reference',
        $comment: 'Non-empty fragments not allowed.',
        pattern: '^[^#]*#?$',
      })
    })
  })

  it('will debundle correctly', () => {
    return deref({
      $id: 'https://example.com/schemas/customer',
      $schema: 'https://json-schema.org/draft/2020-12/schema',

      type: 'object',
      properties: {
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        shipping_address: { $ref: '/schemas/address' },
        billing_address: { $ref: '/schemas/address' },
      },
      required: ['first_name', 'last_name', 'shipping_address', 'billing_address'],

      $defs: {
        address: {
          $id: '/schemas/address',
          $schema: 'http://json-schema.org/draft-07/schema#',

          type: 'object',
          properties: {
            street_address: { type: 'string' },
            city: { type: 'string' },
            state: { $ref: '#/definitions/state' },
          },
          required: ['street_address', 'city', 'state'],

          definitions: {
            state: { enum: ['CA', 'NY', '... etc ...'] },
          },
        },
      },
    }).then(resolvedValue => {
      const billingAddressProps = (
        resolvedValue.properties.billing_address as Record<string, unknown>
      ).properties as Record<string, unknown>
      const shippingAddressProps = (
        resolvedValue.properties.shipping_address as Record<string, unknown>
      ).properties as Record<string, unknown>
      expect(billingAddressProps.state).toEqual({ enum: ['CA', 'NY', '... etc ...'] })
      expect(billingAddressProps.state).toBe(shippingAddressProps.state)
    })
  })

  it('will resolve anchors correctly', () => {
    return deref({
      $id: 'https://example.com/schemas/customer',
      $schema: 'https://json-schema.org/draft/2020-12/schema',

      type: 'object',
      properties: {
        billing_address: { $ref: 'https://example.com/schemas/address#street_address' },
      },
      required: ['first_name', 'last_name', 'shipping_address', 'billing_address'],

      $defs: {
        address: {
          $id: 'https://example.com/schemas/address',

          type: 'object',
          properties: {
            street_address: {
              $anchor: 'street_address',
              type: 'string',
            },
            city: { type: 'string' },
            state: { type: 'string' },
          },
          required: ['street_address', 'city', 'state'],
        },
      },
    }).then(resolvedValue => {
      const billingAddress = resolvedValue.properties.billing_address as Record<string, unknown>
      expect(billingAddress).toEqual({ $anchor: 'street_address', type: 'string' })
    })
  })

  it('dereferences the official spec correctly', () => {
    return deref({
      $ref: 'https://raw.githubusercontent.com/json-schema-org/json-schema-spec/2020-12/schema.json',
    }).then(derefenced => {
      expect(derefenced).not.toHaveProperty('$ref')
    })
  })
})
