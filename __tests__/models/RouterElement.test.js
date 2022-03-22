import { describe, expect, test } from '@jest/globals'
import InvalidArgument from '../../lib/errors/InvalidArgument.js'
import RouterElement from '../../lib/models/RouterElement.js'

describe('check router element configuration', () => {
  test('check undefined configuration', () => {
    expect(() => {
      new RouterElement(Object.name, null)
    }).toThrow(InvalidArgument)
    expect(() => {
      new RouterElement(Object.name, undefined)
    }).toThrow(InvalidArgument)
    expect(() => {
      new RouterElement(Object.name, NaN)
    }).toThrow(InvalidArgument)
  })

  test('check defined configuration', () => {
    expect(() => {
      new RouterElement(Object.name, {})
    }).not.toThrow()
    expect(() => {
      new RouterElement(Object.name, [])
    }).not.toThrow()
  })
})
