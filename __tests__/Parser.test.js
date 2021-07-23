import { describe, expect, test, beforeEach } from '@jest/globals'
import { YAMLException } from 'js-yaml'

import EmptyConfigFile from '../src/errors/EmptyConfigFile'
import EmptyRoutes from '../src/errors/EmptyRoutes'
import FileNotFound from '../src/errors/FileNotFound'
import InvalidArgument from '../src/errors/InvalidArgument'
import InvalidRouteElement from '../src/errors/InvalidRouteElement'
import Parser from '../src/Parser'

import FakeRouter from './mock/FakeRouter'

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
      parser.parseConfig({
        my_super_root: {
          root: '/api',
        },
      })
    }).toThrow(EmptyRoutes)
    expect(() => {
      parser.parseConfig({
        my_super_root: {
          root: '/api',
          routes: null,
        },
      })
    }).toThrow(EmptyRoutes)
    expect(() => {
      parser.parseConfig({
        my_super_root: {
          root: '/api',
          routes: undefined,
        },
      })
    }).toThrow(EmptyRoutes)
    expect(() => {
      parser.parseConfig({
        my_super_root: {
          root: '/api',
          routes: 'yes',
        },
      })
    }).toThrow(InvalidArgument)
    expect(() => {
      parser.parseConfig({
        my_super_root: {
          root: '/api',
          routes: 5,
        },
      })
    }).toThrow(InvalidArgument)
  })

  test('with a none Root/Route', () => {
    expect(() => {
      parser.parseConfig({
        api: {
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
        },
      })
    }).toThrow(InvalidRouteElement)
  })

  test('with valid root and routes arguments', () => {
    expect(() => {
      parser.parseConfig({
        api: {
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
        },
      })
    }).not.toThrow()
  })

  test('with invalid pre_middleware', () => {
    expect(() => {
      parser.parseConfig({
        api: {
          root: '/api',
          pre_middlewares: ['firstMiddleware', 5, 'secondMiddleware'],
          routes: routesTeapot,
        },
      })
    }).toThrow(InvalidArgument)
  })

  test('with valid pre_middleware', () => {
    expect(() => {
      parser.parseConfig({
        api: {
          root: '/api',
          pre_middlewares: null,
          routes: routesTeapot,
        },
      })
    }).not.toThrow()
    expect(() => {
      parser.parseConfig({
        api: {
          root: '/api',
          pre_middlewares: undefined,
          routes: routesTeapot,
        },
      })
    }).not.toThrow()
  })

  test('with invalid post_middleware', () => {
    expect(() => {
      parser.parseConfig({
        api: {
          root: '/api',
          post_middlewares: ['firstMiddleware', 5, 'secondMiddleware'],
          routes: routesTeapot,
        },
      })
    }).toThrow(InvalidArgument)
  })

  test('with valid post_middleware', () => {
    expect(() => {
      parser.parseConfig({
        api: {
          root: '/api',
          post_middlewares: null,
          routes: routesTeapot,
        },
      })
    }).not.toThrow()
    expect(() => {
      parser.parseConfig({
        api: {
          root: '/api',
          post_middlewares: undefined,
          routes: routesTeapot,
        },
      })
    }).not.toThrow()
  })
})

describe('check route configuration', () => {
  test.skip('check invalid path', () => {})

  test.skip('check valid path', () => {})

  test.skip('check invalid controller', () => {})

  test.skip('check valid controller', () => {})

  test.skip('check ', () => {})

  test.skip('check', () => {})
})
