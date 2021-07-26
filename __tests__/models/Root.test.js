import { describe, expect, test } from '@jest/globals'
import { routesTeapot } from './__constants__'

import EmptyRoutes from '../../src/errors/EmptyRoutes'
import InvalidArgument from '../../src/errors/InvalidArgument'

import Root from '../../src/models/Root'
import InvalidRouteElement from '../../src/errors/InvalidRouteElement'

describe('check root configuration', () => {
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
