import { describe, expect, test } from '@jest/globals'
import InvalidArgument from '../../src/errors/InvalidArgument'

import RouterElementMiddleware from '../../src/models/RouterElementMiddleware'

const params = ['pre_middlewares', 'post_middlewares']

describe('check router element with middlewares', () => {
  test('check invalid pre_middlewares', () => {
    expect(() => {
      new RouterElementMiddleware(Object, params, {
        pre_middlewares: ['firstMiddleware', 5, 'secondMiddleware'],
      })
    }).toThrow(InvalidArgument)
  })

  test('check valid pre_middlewares', () => {
    expect(() => {
      new RouterElementMiddleware(Object, params, {
        pre_middlewares: null,
      })
    }).not.toThrow()
    expect(() => {
      new RouterElementMiddleware(Object, params, {
        pre_middlewares: undefined,
      })
    }).not.toThrow()
  })

  test('check invalid post_middlewares', () => {
    expect(() => {
      new RouterElementMiddleware(Object, params, {
        post_middlewares: ['firstMiddleware', 5, 'secondMiddleware'],
      })
    }).toThrow(InvalidArgument)
  })

  test('check valid post_middlewares', () => {
    expect(() => {
      new RouterElementMiddleware(Object, params, {
        post_middlewares: null,
      })
    }).not.toThrow()
    expect(() => {
      new RouterElementMiddleware(Object, params, {
        post_middlewares: undefined,
      })
    }).not.toThrow()
  })
})
