import { describe, expect, test, beforeEach } from '@jest/globals'
import { config } from '../__constants__'

import MiddlewareNotFound from '../../src/errors/MiddlewareNotFound'

import InvalidArgument from '../../src/errors/InvalidArgument'
import Middleware from '../../src/models/Middleware'
import FakeRouter from '../mock/FakeRouter'

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

describe('check middlewares load', () => {
  const middleware = new Middleware('simpleMiddleware')
  const router = new FakeRouter()
  const path = '/api'
  beforeEach(() => router.init())

  describe('check Middleware import', () => {
    test('check wrong middleware', async () => {
      expect(() => {
        new Middleware(null)
      }).toThrow(InvalidArgument)
      expect(() => {
        new Middleware(undefined)
      }).toThrow(InvalidArgument)
      const middleware = new Middleware('nonexistingController')
      await expect(middleware.load(router, path, config.middleware_dir)).rejects.toThrow(MiddlewareNotFound)
    })

    test('check middleware import', async () => {
      const middleware = new Middleware('simpleMiddleware')
      await expect(async () => {
        await expect(middleware.load(router, path, config.middleware_dir)).resolves.not.toThrow()
        expect(middleware.middleware).toBeDefined()
      }).not.toThrow()
    })
  })

  test('check good declaration', async () => {
    await expect(middleware.load(router, path, config.middleware_dir)).resolves.not.toThrow()
    expect(router.orderedCall).toHaveLength(1)
    expect(router.routes.use[path]).toBeDefined()
    expect(typeof router.routes.use[path]).toBe('function')
  })
})
