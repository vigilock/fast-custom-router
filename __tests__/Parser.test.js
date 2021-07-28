import { describe, expect, test, beforeEach } from '@jest/globals'
import { YAMLException } from 'js-yaml'
import { config } from './__constants__'

import Parser from '../src/Parser'

import EmptyConfigFile from '../src/errors/EmptyConfigFile'
import FileNotFound from '../src/errors/FileNotFound'
import InvalidArgument from '../src/errors/InvalidArgument'

import FakeRouter from './mock/FakeRouter'
import InvalidRouteElement from '../src/errors/InvalidRouteElement'

const fakeExpressRouter = new FakeRouter()
const parser = new Parser(fakeExpressRouter, config)

describe('check throwed exceptions on bad files or on creation', () => {
  beforeEach(() => fakeExpressRouter.init())

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
      parser.parseFromFile('wrongFile.yaml')
    }).toThrow(FileNotFound)
    expect(() => {
      parser.parseFromFile('.')
    }).toThrow(FileNotFound)
  })

  test('on invalid yaml syntax', () => {
    expect(() => {
      parser.parseFromFile('exceptionsBadYAML.yaml')
    }).toThrow(YAMLException)
  })

  test('on empty configuration', () => {
    expect(() => {
      parser.parseFromString('')
    }).toThrow(EmptyConfigFile)
  })

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
    }).toThrow(InvalidRouteElement)
    expect(() => {
      parser.parseConfig({
        my_super_root: undefined,
      })
    }).toThrow(InvalidRouteElement)
  })
})
