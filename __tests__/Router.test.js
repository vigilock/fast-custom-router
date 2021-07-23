import { describe, expect, test, beforeEach } from '@jest/globals'
import FakeResponse from './mock/FakeResponse'
import FakeRouter from './mock/FakeRouter'
import Router from '../src/Router'

describe('check router template route', () => {
  const router = new Router(null)
  const fakeResponse = {
    status: () => {},
    json: () => {},
  }

  test('check route call controller with right parameters', async () => {
    const route = router.getRoute(
      (arg1, arg2) => {
        expect(arg1).toEqual('superValue')
        expect(arg2).toEqual(42)
        return 'result'
      },
      200,
      () => [
        {
          type: String,
          value: 'superValue',
        },
        {
          type: Number,
          value: '42',
        },
      ],
    )
    try {
      await route(null, fakeResponse, error => {
        expect(error).toBeNull()
      })
    } catch (error) {
      expect(error).toBeNull()
    }
  })

  test('check route call controller with wrong parameters', async () => {
    const route = router.getRoute(
      () => {
        expect('Should not be executed').toEqual(false)
      },
      200,
      () => [
        {
          type: () => {
            throw new Error('wrong parameter')
          },
          value: 'superValue',
        },
      ],
    )
    try {
      await route(null, fakeResponse, err => {
        expect(err.message).toEqual('wrong parameter')
      })
    } catch (error) {
      expect(error).toBeNull()
    }
  })

  test('check route call controller with default parameters', async () => {
    const route = router.getRoute(
      arg => {
        expect(arg).toEqual('my default value')
      },
      200,
      () => [
        {
          type: String,
          value: undefined,
          optionnal: true,
          defaultValue: 'my default value',
        },
      ],
    )
    try {
      await route(null, fakeResponse, error => {
        expect(error).toBeNull()
      })
    } catch (error) {
      expect(error).toBeNull()
    }
  })

  test('check route call controller with json response', async () => {
    const route = router.getRoute(() => 'my super response', 200)
    const res = new FakeResponse()
    try {
      await route(null, res, error => {
        expect(error).toBeNull()
      })
      expect(res._json).toEqual('my super response')
    } catch (error) {
      expect(error).toBeNull()
    }
  })
})

describe('check if Router has right behavior', () => {
  const fakeRouter = new FakeRouter()
  const router = new Router(fakeRouter)

  beforeEach(() => {
    fakeRouter.init()
  })

  test('Add get route', () => {
    router.get({
      path: '/super/path/get',
      controller: () => {},
    })
    expect(Object.keys(fakeRouter.routes.get)).toHaveLength(1)
    expect(Object.keys(fakeRouter.routes.get)[0]).toEqual('/super/path/get')
  })
  test('Add post route', () => {
    router.post({
      path: '/super/path/post',
      controller: () => {},
    })
    expect(Object.keys(fakeRouter.routes.post)).toHaveLength(1)
    expect(Object.keys(fakeRouter.routes.post)[0]).toEqual('/super/path/post')
  })
  test('Add put route', () => {
    router.put({
      path: '/super/path/put',
      controller: () => {},
    })
    expect(Object.keys(fakeRouter.routes.put)).toHaveLength(1)
    expect(Object.keys(fakeRouter.routes.put)[0]).toEqual('/super/path/put')
  })
  test('Add delete route', () => {
    router.delete({
      path: '/super/path/delete',
      controller: () => {},
    })
    expect(Object.keys(fakeRouter.routes.delete)).toHaveLength(1)
    expect(Object.keys(fakeRouter.routes.delete)[0]).toEqual('/super/path/delete')
  })
})
