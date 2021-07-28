import { describe, expect, test } from '@jest/globals'

import EmptyRoutes from '../../src/errors/EmptyRoutes'
import InvalidArgument from '../../src/errors/InvalidArgument'

import Root from '../../src/models/Root'

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
        routes: NaN,
      })
    }).toThrow(EmptyRoutes)
    expect(() => {
      new Root('name', {
        root: '/api',
        routes: {},
      })
    }).toThrow(EmptyRoutes)
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
                  id: 'number',
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
})
