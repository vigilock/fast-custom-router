import { describe, expect, test, beforeEach, jest } from '@jest/globals'
import { config } from '../__constants__.js'

import FakeRouter from '../mock/FakeRouter.js'
import SimpleMiddleware from '../middleware/simpleMiddleware.js'

import InvalidArgument from '../../lib/errors/InvalidArgument.js'

import Middleware from '../../lib/models/Middleware.js'

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
      jest.spyOn(middleware, '__loadModule').mockImplementation(() => {
        throw new Error()
      })
      await expect(middleware.load(router, path, config.middleware_dir)).rejects.toThrow()
    })

    test('check middleware import', async () => {
      const middleware = new Middleware('simpleMiddleware')
      jest.spyOn(middleware, '__loadModule').mockImplementation(() => SimpleMiddleware)
      await middleware.load(router, path, config.middleware_dir)
      expect(middleware.middleware).toBeDefined()
    })
  })

  test('check good declaration', async () => {
    const middleware = new Middleware('simpleMiddleware')
    jest.spyOn(middleware, '__loadModule').mockImplementation(() => SimpleMiddleware)
    await middleware.load(router, path, config.middleware_dir)
    expect(router.orderedCall).toHaveLength(1)
    expect(router.routes.use[path]).toBeDefined()
    expect(typeof router.routes.use[path]).toBe('function')
  })
})
