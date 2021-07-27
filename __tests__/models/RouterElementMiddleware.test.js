import { describe, expect, test, beforeEach } from '@jest/globals'
import { config } from '../__constants__'

import FakeRouter from '../mock/FakeRouter'

import InvalidArgument from '../../src/errors/InvalidArgument'

import RouterElementMiddleware from '../../src/models/RouterElementMiddleware'

describe('check router element with middlewares', () => {
  test('check valid pre_middlewares', () => {
    const el = new RouterElementMiddleware(Object, [], {
      pre_middlewares: ['simpleMiddleware'],
    })
    expect(el.pre_middlewares).toHaveLength(1)
    expect(el.pre_middlewares[0].name).toBe('simpleMiddleware')
  })

  test('check invalid pre_middlewares', () => {
    expect(() => {
      new RouterElementMiddleware(Object, [], {
        pre_middlewares: ['firstMiddleware', 5, 'secondMiddleware', true, false],
      })
    }).toThrow(InvalidArgument)
    expect(() => {
      new RouterElementMiddleware(Object, [], {
        pre_middlewares: null,
      })
    }).not.toThrow()
    expect(() => {
      new RouterElementMiddleware(Object, [], {
        pre_middlewares: undefined,
      })
    }).not.toThrow()
  })

  test('check valid post_middlewares', () => {
    const el = new RouterElementMiddleware(Object, [], {
      pre_middlewares: ['simpleMiddleware'],
    })
    expect(el.pre_middlewares).toHaveLength(1)
    expect(el.pre_middlewares[0].name).toBe('simpleMiddleware')
  })

  test('check invalid post_middlewares', () => {
    expect(() => {
      new RouterElementMiddleware(Object, [], {
        post_middlewares: ['firstMiddleware', 5, 'secondMiddleware', true, false],
      })
    }).toThrow(InvalidArgument)
    expect(() => {
      new RouterElementMiddleware(Object, [], {
        post_middlewares: null,
      })
    }).not.toThrow()
    expect(() => {
      new RouterElementMiddleware(Object, [], {
        post_middlewares: undefined,
      })
    }).not.toThrow()
  })
})

describe.skip('load middlewares', () => {
  const router = new FakeRouter()
  beforeEach(() => router.init())

  test('load empty middlewares lists', async () => {
    const el = new RouterElementMiddleware(Object, [], {})
    await el.__loadPreMiddlewares(router, '/', config.middleware_dir)
    await el.__loadPostMiddlewares(router, '/', config.middleware_dir)
  })

  test('load pre_middlewares', async () => {
    const el = new RouterElementMiddleware(Object, [], {
      pre_middlewares: ['simpleMiddleware'],
    })
    await el.__loadPreMiddlewares(router, '/', config.middleware_dir)
    await el.__loadPostMiddlewares(router, '/', config.middleware_dir)
  })

  test('load post_middlewares', async () => {
    const el = new RouterElementMiddleware(Object, [], {
      post_middlewares: ['simpleMiddleware'],
    })
    await el.__loadPreMiddlewares(router, '/', config.middleware_dir)
    await el.__loadPostMiddlewares(router, '/', config.middleware_dir)
  })

  test('load all middlewares', async () => {
    const el = new RouterElementMiddleware(Object, [], {
      pre_middlewares: ['simpleMiddleware'],
      post_middlewares: ['simpleMiddleware'],
    })
    await el.__loadPreMiddlewares(router, '/', config.middleware_dir)
    await el.__loadPostMiddlewares(router, '/', config.middleware_dir)
  })
})
