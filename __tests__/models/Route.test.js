import { describe, expect, test } from '@jest/globals'
import { routesTeapot } from './__constants__'

import InvalidArgument from '../../src/errors/InvalidArgument'
import EmptyMethods from '../../src/errors/EmptyMethods'

import Route from '../../src/models/Route'

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
    }).not.toThrow()
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
