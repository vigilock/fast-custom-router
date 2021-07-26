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
    expect(() => {
      new Route('name', {
        path: '/teapot',
        methods: {},
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
})
