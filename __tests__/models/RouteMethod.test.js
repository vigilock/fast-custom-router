import { describe, expect, test } from '@jest/globals'
import { routesTeapot } from './__constants__'

import InvalidArgument from '../../src/errors/InvalidArgument'

import RouteMethod from '../../src/models/RouteMethod'
import { config } from '../__constants__'
import ControllerNotFound from '../../src/errors/ControllerNotFound'

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
    await expect(method.loadController(config.controller_dir)).rejects.toThrow(ControllerNotFound)
  })

  test('check controller import', async () => {
    const method = new RouteMethod('post', routesTeapot.teapot.methods.get)
    expect(async () => {
      await expect(method.loadController(config.controller_dir)).resolves.not.toThrow()
      expect(method.controller).toBeDefined()
    }).not.toThrow()
  })

  test('with invalid pre_middlewares', () => {
    expect(() => {
      new RouteMethod('GET', {
        controller: 'getTeapot',
        pre_middlewares: ['firstMiddleware', 5, 'secondMiddleware'],
      })
    }).toThrow(InvalidArgument)
  })

  test('with valid pre_middlewares', () => {
    expect(() => {
      new RouteMethod('GET', {
        controller: 'getTeapot',
        pre_middlewares: null,
      })
    }).not.toThrow()
    expect(() => {
      new RouteMethod('GET', {
        controller: 'getTeapot',
        pre_middlewares: undefined,
      })
    }).not.toThrow()
  })

  test('with invalid post_middlewares', () => {
    expect(() => {
      new RouteMethod('GET', {
        controller: 'getTeapot',
        post_middlewares: ['firstMiddleware', 5, 'secondMiddleware'],
      })
    }).toThrow(InvalidArgument)
  })

  test('with valid post_middlewares', () => {
    expect(() => {
      new RouteMethod('GET', {
        controller: 'getTeapot',
        post_middlewares: null,
      })
    }).not.toThrow()
    expect(() => {
      new RouteMethod('GET', {
        controller: 'getTeapot',
        post_middlewares: undefined,
      })
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
