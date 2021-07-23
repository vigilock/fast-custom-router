import { describe, expect, test, beforeEach } from '@jest/globals'
import { YAMLException } from 'js-yaml'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import Parser from '../src/Parser'
import Root from '../src/models/Root'
import Route from '../src/models/Route'

import EmptyConfigFile from '../src/errors/EmptyConfigFile'
import EmptyRoutes from '../src/errors/EmptyRoutes'
import FileNotFound from '../src/errors/FileNotFound'
import InvalidArgument from '../src/errors/InvalidArgument'
import InvalidRouteElement from '../src/errors/InvalidRouteElement'

import FakeRouter from './mock/FakeRouter'
import EmptyMethods from '../src/errors/EmptyMethods'
import RouteMethod from '../src/models/RouteMethod'
import ControllerNotFound from '../src/errors/ControllerNotFound'

const __dirname = dirname(fileURLToPath(import.meta.url))

const config = {
  controller_dir: join(__dirname, 'controller'),
}
const fakeExpressRouter = new FakeRouter()
const parser = new Parser(fakeExpressRouter, config)

const routesTeapot = {
  teapot: {
    path: '/teapot',
    methods: {
      get: {
        controller: 'getTeapot',
        response_code: 418,
      },
    },
  },
}

beforeEach(() => fakeExpressRouter.init())

describe('check throwed exceptions on bad files or on creation', () => {
  test('on bad router', () => {
    expect(() => {
      new Parser(null)
    }).toThrow(TypeError)
    expect(() => {
      new Parser(undefined)
    }).toThrow(TypeError)
  })

  test('on file not found or is directory', () => {
    expect(() => {
      parser.loadFromFile('./wrongFile.yaml')
    }).toThrow(FileNotFound)
    expect(() => {
      parser.loadFromFile('.')
    }).toThrow(FileNotFound)
  })

  test('on invalid yaml syntax', () => {
    expect(() => {
      parser.loadFromFile('__tests__/config/exceptionsBadYAML.yaml')
    }).toThrow(YAMLException)
  })

  test('on empty configuration', () => {
    expect(() => {
      parser.loadFromString('')
    }).toThrow(EmptyConfigFile)
  })
})

describe('check root configuration', () => {
  test('with invalid root argument', () => {
    expect(() => {
      parser.parseConfig({
        my_super_root: {
          root: '$^&é"',
        },
      })
    }).toThrow(InvalidArgument)
    expect(() => {
      parser.parseConfig({
        my_super_root: null,
      })
    }).toThrow(InvalidArgument)
    expect(() => {
      parser.parseConfig({
        my_super_root: undefined,
      })
    }).toThrow(InvalidArgument)
  })

  test('with invalid routes argument', () => {
    expect(() => {
      new Root('name', {
        root: '/api',
      })
    }).toThrow(EmptyRoutes)
    expect(() => {
      new Root('name', {
        root: '/api',
        routes: null,
      })
    }).toThrow(EmptyRoutes)
    expect(() => {
      new Root('name', {
        root: '/api',
        routes: undefined,
      })
    }).toThrow(EmptyRoutes)
    expect(() => {
      new Root('name', {
        root: '/api',
        routes: 'yes',
      })
    }).toThrow(InvalidArgument)
    expect(() => {
      new Root('name', {
        root: '/api',
        routes: 5,
      })
    }).toThrow(InvalidArgument)
  })

  test('with a none Root/Route', () => {
    expect(() => {
      new Root('name', {
        root: '/api',
        routes: {
          teapot: {
            methods: {
              get: {
                controller: 'getTeapot',
              },
            },
          },
        },
      })
    }).toThrow(InvalidRouteElement)
  })

  test('with valid root and routes arguments', () => {
    expect(() => {
      new Root('name', {
        root: '/api',
        routes: {
          teapot: {
            path: '/teapot',
            methods: {
              get: {
                controller: 'getTeapot',
              },
            },
          },
          userRoot: {
            root: '/user',
            routes: {
              getUser: {
                path: '/:id',
                query: {
                  id: 'ObjectId',
                },
                methods: {
                  get: {
                    controller: 'getUser',
                  },
                },
              },
            },
          },
        },
      })
    }).not.toThrow()
  })

  test('with invalid pre_middlewares', () => {
    expect(() => {
      new Root('name', {
        root: '/api',
        pre_middlewares: ['firstMiddleware', 5, 'secondMiddleware'],
        routes: routesTeapot,
      })
    }).toThrow(InvalidArgument)
  })

  test('with valid pre_middlewares', () => {
    expect(() => {
      new Root('name', {
        root: '/api',
        pre_middlewares: null,
        routes: routesTeapot,
      })
    }).not.toThrow()
    expect(() => {
      new Root('name', {
        root: '/api',
        pre_middlewares: undefined,
        routes: routesTeapot,
      })
    }).not.toThrow()
  })

  test('with invalid post_middlewares', () => {
    expect(() => {
      new Root('name', {
        root: '/api',
        post_middlewares: ['firstMiddleware', 5, 'secondMiddleware'],
        routes: routesTeapot,
      })
    }).toThrow(InvalidArgument)
  })

  test('with valid post_middlewares', () => {
    expect(() => {
      new Root('name', {
        root: '/api',
        post_middlewares: null,
        routes: routesTeapot,
      })
    }).not.toThrow()
    expect(() => {
      new Root('name', {
        root: '/api',
        post_middlewares: undefined,
        routes: routesTeapot,
      })
    }).not.toThrow()
  })
})

describe('check route configuration', () => {
  test('check invalid configuration', () => {
    expect(() => {
      new Route('name', null)
    }).toThrow(InvalidArgument)
    expect(() => {
      new Route('name', undefined)
    }).toThrow(InvalidArgument)
    expect(() => {
      new Route('name', NaN)
    }).toThrow(InvalidArgument)
  })

  test('check invalid path', () => {
    expect(() => {
      new Route('name', {
        path: 'qsdflkjqsdf/§$^:azer',
      })
    }).toThrow(InvalidArgument)
    expect(() => {
      new Route('name', {
        path: 'ii',
      })
    }).toThrow(InvalidArgument)
  })

  test('check valid path', () => {
    expect(() => {
      new Route('name', routesTeapot.teapot)
    }).not.toThrow()
  })

  test('check invalid methods', () => {
    expect(() => {
      new Route('name', {
        path: '/teapot',
        methods: null,
      })
    }).toThrow(EmptyMethods)
    expect(() => {
      new Route('name', {
        path: '/teapot',
        methods: undefined,
      })
    }).toThrow(EmptyMethods)
  })

  test('check valid methods', () => {
    expect(() => {
      new Route('name', {
        path: '/teapot',
        methods: routesTeapot.teapot.methods,
      })
    })
  })

  test('with invalid pre_middlewares', () => {
    expect(() => {
      new Route('name', {
        path: '/teapot',
        pre_middlewares: ['firstMiddleware', 5, 'secondMiddleware'],
        methods: routesTeapot.teapot.methods,
      })
    }).toThrow(InvalidArgument)
  })

  test('with valid pre_middlewares', () => {
    expect(() => {
      new Route('name', {
        path: '/teapot',
        pre_middlewares: null,
        methods: routesTeapot.teapot.methods,
      })
    }).not.toThrow()
    expect(() => {
      new Route('name', {
        path: '/teapot',
        pre_middlewares: undefined,
        methods: routesTeapot.teapot.methods,
      })
    }).not.toThrow()
  })

  test('with invalid post_middlewares', () => {
    expect(() => {
      new Route('name', {
        path: '/teapot',
        post_middlewares: ['firstMiddleware', 5, 'secondMiddleware'],
        methods: routesTeapot.teapot.methods,
      })
    }).toThrow(InvalidArgument)
  })

  test('with valid post_middlewares', () => {
    expect(() => {
      new Route('name', {
        path: '/teapot',
        post_middlewares: null,
        methods: routesTeapot.teapot.methods,
      })
    }).not.toThrow()
    expect(() => {
      new Route('name', {
        path: '/teapot',
        post_middlewares: undefined,
        methods: routesTeapot.teapot.methods,
      })
    }).not.toThrow()
  })
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
      await method.loadController(config.controller_dir)
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

  test.skip('with invalid body', () => {
    expect(() => {
      new RouteMethod('GET', {
        controller: 'getTeapot',
        body: ['firstMiddleware', 5, 'secondMiddleware'],
      })
    }).toThrow(InvalidArgument)
  })

  test.skip('with valid body', () => {
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
  })
})

describe.skip('check route body configuration', () => {
  test('check wrong types', () => {
    expect(() => {
      new RouteMethod('GET', {})
    })
  })

  test('check valid types', () => {
    expect(() => {
      new RouteMethod('GET', {})
    })
  })

  test('check default value option', () => {})
})
