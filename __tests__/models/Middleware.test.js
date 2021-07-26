import { describe, expect, test } from '@jest/globals'
import InvalidArgument from '../../src/errors/InvalidArgument'
import Middleware from '../../src/models/Middleware'

describe('check Middleware configuration', () => {
  test('check invalid name', () => {
    expect(() => {
      new Middleware(null)
    }).toThrow(InvalidArgument)
    expect(() => {
      new Middleware(undefined)
    }).toThrow(InvalidArgument)
    expect(() => {
      new Middleware(NaN)
    }).toThrow(InvalidArgument)
  })

  test('check with others types than string', () => {
    expect(() => {
      new Middleware('')
    }).toThrow(InvalidArgument)
    expect(() => {
      new Middleware(5)
    }).toThrow(InvalidArgument)
    expect(() => {
      new Middleware(true)
    }).toThrow(InvalidArgument)
    expect(() => {
      new Middleware(false)
    }).toThrow(InvalidArgument)
  })

  test('check valid name', () => {
    expect(() => {
      new Middleware('my_super_name')
    }).not.toThrow()
    expect(() => {
      new Middleware('name')
    }).not.toThrow()
  })
})
