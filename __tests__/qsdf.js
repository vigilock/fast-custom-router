import { describe, expect, test, jest } from '@jest/globals'

import FakeRouter from './mock/FakeRouter'
import Middleware from '../src/models/Middleware'

describe('ouiiiii', () => {
  const router = new FakeRouter()
  const path = '/api'
  test('noooooo', async () => {
    const middleware = new Middleware('qsdfqsdfqsdf')
    jest.spyOn(middleware, '__loadModule').mockImplementation(() => {
      console.log('mock runs !')
      return 'myDefault'
    })
    await middleware.load(router, path, 'superdir')
    console.log(router.orderedCall[0])
  })
})
