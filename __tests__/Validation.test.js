import { describe, expect, test } from '@jest/globals'
import Validation, { validParams } from '../src/Validation'

describe('check parameter casts', () => {
  test('check Number validation', () => {
    expect(Validation.NUMBER(-1)).toEqual(-1)
    expect(Validation.NUMBER(0)).toEqual(0)
    expect(Validation.NUMBER(5)).toEqual(5)
    expect(Validation.NUMBER(12345)).toEqual(12345)
    expect(Validation.NUMBER('123')).toEqual(123)
    expect(Validation.NUMBER('qsdf')).toEqual(NaN)
    expect(Validation.NUMBER(true)).toEqual(1)
    expect(Validation.NUMBER(false)).toEqual(0)
  })

  test('check Boolean validation', () => {
    expect(Validation.BOOLEAN(true)).toEqual(true)
    expect(Validation.BOOLEAN(false)).toEqual(false)
    expect(Validation.BOOLEAN('qsdf')).toEqual(true)
    expect(Validation.BOOLEAN(null)).toEqual(false)
    expect(Validation.BOOLEAN(undefined)).toEqual(false)
    expect(Validation.BOOLEAN(NaN)).toEqual(false)
    expect(Validation.BOOLEAN('')).toEqual(false)
  })

  test('check String', () => {
    expect(Validation.STRING(-12)).toEqual('-12')
    expect(Validation.STRING(123)).toEqual('123')
    expect(Validation.STRING('qsdfqsdf')).toEqual('qsdfqsdf')
    expect(Validation.STRING(true)).toEqual('true')
    expect(Validation.STRING(false)).toEqual('false')
  })
})

describe('check router paramaters validation', () => {
  test('check non optionnal parameters', () => {
    const params = [
      {
        type: Boolean,
        value: true,
      },
    ]
    const { validedParams, paramsAreValid } = validParams(params)
    expect(paramsAreValid).toEqual(true)
    expect(validedParams).toStrictEqual([true])
  })

  test('check optionnal parameters', () => {
    const params = [
      {
        type: Boolean,
        value: null,
        optionnal: true,
      },
      {
        type: String,
        value: null,
        optionnal: true,
        defaultValue: 'default',
      },
    ]
    const { validedParams, paramsAreValid } = validParams(params)
    expect(paramsAreValid).toEqual(true)
    expect(validedParams).toStrictEqual([undefined, 'default'])
  })
})
