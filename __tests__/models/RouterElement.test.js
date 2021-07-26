import { describe, expect, test } from '@jest/globals'
import InvalidArgument from '../../src/errors/InvalidArgument'
import RouterElement from '../../src/models/RouterElement'

describe('check router element configuration', () => {
  test('check undefined configuration', () => {
    expect(() => {
      new RouterElement(Object, [], null)
    }).toThrow(InvalidArgument)
    expect(() => {
      new RouterElement(Object, [], undefined)
    }).toThrow(InvalidArgument)
    expect(() => {
      new RouterElement(Object, [], NaN)
    }).toThrow(InvalidArgument)
  })

  test('check defined configuration', () => {
    expect(() => {
      new RouterElement(Object, [], {})
    }).not.toThrow()
    expect(() => {
      new RouterElement(Object, [], [])
    }).not.toThrow()
  })
})
