import { describe, expect, test } from '@jest/globals'
import InvalidArgument from '../../lib/errors/InvalidArgument.js'

import RouteParameter from '../../lib/models/RouteParameter.js'
import Validation from '../../lib/Validation.js'

const validConfig = { type: 'NUMBER', default_value: 4321 }

describe('check route parameter configuration', () => {
  test('check invalid name', () => {
    expect(() => {
      new RouteParameter(null, validConfig)
    }).toThrow(InvalidArgument)
    expect(() => {
      new RouteParameter(undefined, validConfig)
    }).toThrow(InvalidArgument)
    expect(() => {
      new RouteParameter(NaN, validConfig)
    }).toThrow(InvalidArgument)
    expect(() => {
      new RouteParameter(validConfig, validConfig)
    }).toThrow(InvalidArgument)
  })

  test('check valid name', () => {
    expect(() => {
      const p = new RouteParameter('valid_name', validConfig)
      expect(p.name).toEqual('valid_name')
      expect(p.type).toEqual(Validation.NUMBER)
      expect(p.default_value).toEqual(validConfig.default_value)
    }).not.toThrow()
  })

  test('check invalid config', () => {
    expect(() => {
      new RouteParameter('name', null)
    }).toThrow(InvalidArgument)
    expect(() => {
      new RouteParameter('name', undefined)
    }).toThrow(InvalidArgument)
    expect(() => {
      new RouteParameter('name', NaN)
    }).toThrow(InvalidArgument)
    expect(() => {
      new RouteParameter('name', {})
    }).toThrow(InvalidArgument)
    expect(() => {
      new RouteParameter('name', [])
    }).toThrow(InvalidArgument)
  })

  test('check invalid type', () => {
    expect(() => {
      new RouteParameter('name', { type: null })
    }).toThrow(InvalidArgument)
    expect(() => {
      new RouteParameter('name', { type: undefined })
    }).toThrow(InvalidArgument)
    expect(() => {
      new RouteParameter('name', { type: NaN })
    }).toThrow(InvalidArgument)
    expect(() => {
      new RouteParameter('name', { type: 'invalid' })
    }).toThrow(InvalidArgument)
    expect(() => {
      new RouteParameter('name', 'invalid')
    }).toThrow(InvalidArgument)
  })

  test('check valid type', () => {
    expect(() => {
      const p = new RouteParameter('name', {
        type: 'Number',
        default_value: 0,
      })
      expect(p.type).toBe(Validation.NUMBER)
    }).not.toThrow()
    expect(() => {
      const p = new RouteParameter('name', {
        type: 'number',
        default_value: 0,
      })
      expect(p.type).toBe(Validation.NUMBER)
    }).not.toThrow()
    expect(() => {
      const p = new RouteParameter('name', {
        type: 'NUMBER',
        default_value: 0,
      })
      expect(p.type).toBe(Validation.NUMBER)
    }).not.toThrow()
    expect(() => {
      const p = new RouteParameter('name', {
        type: 'string',
        default_value: 'default',
      })
      expect(p.type).toBe(String)
    }).not.toThrow()
    expect(() => {
      const p = new RouteParameter('name', {
        type: 'String',
        default_value: 'fdefault',
      })
      expect(p.type).toBe(String)
    }).not.toThrow()
    expect(() => {
      const p = new RouteParameter('name', {
        type: 'STRING',
        default_value: 'default',
      })
      expect(p.type).toBe(String)
    }).not.toThrow()
    expect(() => {
      const p = new RouteParameter('name', 'string')
      expect(p.type).toBe(String)
    }).not.toThrow()
    expect(() => {
      const p = new RouteParameter('name', 'String')
      expect(p.type).toBe(String)
    }).not.toThrow()
    expect(() => {
      const p = new RouteParameter('name', 'STRING')
      expect(p.type).toBe(String)
    }).not.toThrow()
  })

  test('check default value', () => {
    expect(() => {
      const p = new RouteParameter('name', {
        type: 'number',
        default_value: 123,
      })
      expect(p.optionnal).toBeTruthy()
      expect(p.default_value).toEqual(123)
    }).not.toThrow()
    expect(() => {
      const p = new RouteParameter('name', {
        type: 'string',
        default_value: 'my super string',
      })
      expect(p.optionnal).toBeTruthy()
      expect(p.default_value).toEqual('my super string')
    }).not.toThrow()
    expect(() => {
      const p = new RouteParameter('name', {
        type: 'boolean',
        default_value: false,
      })
      expect(p.optionnal).toBeTruthy()
      expect(p.default_value).toEqual(false)
    }).not.toThrow()
  })
})
