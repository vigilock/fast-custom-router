import { describe, expect, test, beforeEach, jest } from '@jest/globals'
import { routesTeapot } from './__constants__'
import { config } from '../__constants__'

import FakeRouter from '../mock/FakeRouter.js'
import getTeapot from '../controller/getTeapot.js'

import InvalidArgument from '../../lib/errors/InvalidArgument.js'
import ModuleNotFound from '../../lib/errors/ModuleNotFound.js'

import RouteMethod from '../../lib/models/RouteMethod.js'

beforeEach(() => {
  jest.useFakeTimers()
})

describe('check route method configuration', () => {
  test('check invalid configuration', () => {
    expect(() => {
      new RouteMethod('name', null)
    }).toThrow(InvalidArgument)
    expect(() => {
      new RouteMethod('name', undefined)
    }).toThrow(InvalidArgument)
    expect(() => {
      new RouteMethod('name', NaN)
    }).toThrow(InvalidArgument)
  })

  test('check wrong methods', () => {
    expect(() => {
      new RouteMethod(null, routesTeapot.teapot.methods.get)
    }).toThrow(InvalidArgument)
    expect(() => {
      new RouteMethod(undefined, routesTeapot.teapot.methods.get)
    }).toThrow(InvalidArgument)
    expect(() => {
      new RouteMethod(NaN, routesTeapot.teapot.methods.get)
    }).toThrow(InvalidArgument)
    expect(() => {
      new RouteMethod('WRONG_METHOD', routesTeapot.teapot.methods.get)
    }).toThrow(InvalidArgument)
  })

  test('check valid method names', () => {
    expect(() => {
      new RouteMethod('GET', routesTeapot.teapot.methods.get)
    }).not.toThrow()
    expect(() => {
      new RouteMethod('POST', routesTeapot.teapot.methods.get)
    }).not.toThrow()
    expect(() => {
      new RouteMethod('PUT', routesTeapot.teapot.methods.get)
    }).not.toThrow()
    expect(() => {
      new RouteMethod('DELETE', routesTeapot.teapot.methods.get)
    }).not.toThrow()
    expect(() => {
      new RouteMethod('get', routesTeapot.teapot.methods.get)
    }).not.toThrow()
    expect(() => {
      new RouteMethod('post', routesTeapot.teapot.methods.get)
    }).not.toThrow()
    expect(() => {
      new RouteMethod('put', routesTeapot.teapot.methods.get)
    }).not.toThrow()
    expect(() => {
      new RouteMethod('delete', routesTeapot.teapot.methods.get)
    }).not.toThrow()
  })

  test('with invalid body', () => {
    expect(() => {
      new RouteMethod('GET', {
        controller: 'getTeapot',
        body: null,
      })
    }).not.toThrow()
    expect(() => {
      new RouteMethod('GET', {
        controller: 'getTeapot',
        body: undefined,
      })
    }).not.toThrow()
    expect(() => {
      new RouteMethod('GET', {
        controller: 'getTeapot',
        body: NaN,
      })
    }).not.toThrow()
    expect(() => {
      new RouteMethod('GET', {
        controller: 'getTeapot',
        body: ['name', 'date', 'content'],
      })
    }).toThrow(InvalidArgument)
  })

  test('with valid body', () => {
    expect(() => {
      new RouteMethod('GET', {
        controller: 'getTeapot',
        body: {
          name: {
            type: 'STRING',
          },
          date: {
            type: 'NUMBER',
            default_value: 0,
          },
        },
      })
    }).not.toThrow()
    expect(() => {
      new RouteMethod('GET', {
        controller: 'getTeapot',
      })
    }).not.toThrow()
  })
})

describe('load route with express', () => {
  const router = new FakeRouter()
  const path = '/api/user'
  beforeEach(() => router.init())

  describe('check controller import', () => {
    test('check wrong controller', async () => {
      expect(() => {
        new RouteMethod('GET', {
          controller: null,
        })
      }).toThrow(InvalidArgument)
      expect(() => {
        new RouteMethod('GET', {
          controller: undefined,
        })
      }).toThrow(InvalidArgument)
      const method = new RouteMethod('post', {
        controller: 'nonexistingController',
      })
      jest.spyOn(method, '__loadModule').mockImplementation(() => getTeapot)
      await expect(method.load(router, path, config))
        .rejects.toThrow(ModuleNotFound)
        .catch(() => {})
    })

    test('check controller import', async () => {
      const method = new RouteMethod('post', routesTeapot.teapot.methods.get)
      jest.spyOn(method, '__loadModule').mockImplementation(() => getTeapot)
      await method.load(router, path, config)
      expect(method.controller).toBeDefined()
    })
  })

  test('load route', async () => {
    const method = new RouteMethod('GET', {
      controller: 'getTeapot',
    })
    jest.spyOn(method, '__loadModule').mockImplementation(() => getTeapot)
    await expect(method.load(router, path, config))
      .resolves.not.toThrow()
      .catch(() => {})
    expect(router.orderedCall).toHaveLength(1)
    expect(router.routes.get['/api/user']).toBeDefined()
    expect(router.orderedCall[0].route).toBeDefined()
  })
})
