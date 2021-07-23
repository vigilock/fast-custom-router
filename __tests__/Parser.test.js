import { describe, expect, test, beforeEach } from '@jest/globals'
import { YAMLException } from 'js-yaml'

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

const fakeExpressRouter = new FakeRouter()
const parser = new Parser(fakeExpressRouter)

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
