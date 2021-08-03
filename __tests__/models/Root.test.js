import { describe, expect, test } from '@jest/globals'

import EmptyRoutes from '../../lib/errors/EmptyRoutes.js'
import InvalidArgument from '../../lib/errors/InvalidArgument.js'

import Root from '../../lib/models/Root.js'
import Parser from '../../lib/Parser.js'

const parser = Parser.__parseRouteElements

describe('check root configuration', () => {
  test('with invalid routes argument', () => {
    expect(() => {
      new Root(
        'name',
        {
          root: '/api',
        },
        undefined,
        parser,
      )
    }).toThrow(EmptyRoutes)
    expect(() => {
      new Root(
        'name',
        {
          root: '/api',
          routes: null,
        },
        undefined,
        parser,
      )
    }).toThrow(EmptyRoutes)
    expect(() => {
      new Root(
        'name',
        {
          root: '/api',
          routes: undefined,
        },
        undefined,
        parser,
      )
    }).toThrow(EmptyRoutes)
    expect(() => {
      new Root(
        'name',
        {
          root: '/api',
          routes: 'yes',
        },
        undefined,
        parser,
      )
    }).toThrow(InvalidArgument)
    expect(() => {
      new Root(
        'name',
        {
          root: '/api',
          routes: 5,
        },
        undefined,
        parser,
      )
    }).toThrow(InvalidArgument)
  })

  test('with a none Root/Route', () => {
    expect(() => {
      new Root(
        'name',
        {
          root: '/api',
          routes: null,
        },
        undefined,
        parser,
      )
    }).toThrow(EmptyRoutes)
    expect(() => {
      new Root(
        'name',
        {
          root: '/api',
          routes: undefined,
        },
        undefined,
        parser,
      )
    }).toThrow(EmptyRoutes)
    expect(() => {
      new Root(
        'name',
        {
          root: '/api',
          routes: NaN,
        },
        undefined,
        parser,
      )
    }).toThrow(EmptyRoutes)
    expect(() => {
      new Root(
        'name',
        {
          root: '/api',
          routes: {},
        },
        undefined,
        parser,
      )
    }).toThrow(EmptyRoutes)
  })

  test('with valid root and routes arguments', () => {
    expect(() => {
      new Root(
        'name',
        {
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
                  params: {
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
        },
        undefined,
        parser,
      )
    }).not.toThrow()
  })
})
