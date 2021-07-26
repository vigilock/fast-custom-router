import { validParams } from '../src/Validation'

import './__typesdef__'

/** Custom express router */
export default class Router {
  /**
   * Create a custom router on top of an Express router.
   *
   * @param {Express.Router} router Express router
   */
  constructor(router) {
    this.router = router
  }

  /**
   * Get route callback
   *
   * @param {Function} controller Route controller
   * @param {Number} successStatusCode Http status code in response to a success query, 200 by default
   * @param {(req: Express.Request) => {}} getParams Function that returns list of Parameter
   * @returns Route callback
   */
  getRoute(controller, successStatusCode = 200, getParams = null) {
    return async (req, res, next) => {
      const params = getParams ? getParams(req) : []
      const { validedParams, paramsAreValid } = validParams(params, next)
      if (paramsAreValid) {
        try {
          const result = await controller(...validedParams)
          res.status(successStatusCode)
          if (result) res.json(result)
          else res.json()
        } catch (error) {
          next(error)
        }
      }
    }
  }

  /**
   * GET route method
   *
   * @param {RouterConfiguration} options Options object
   * @see {@link Express.Router.get} for further information.
   */
  get(options) {
    this.router.get(options.path, this.getRoute(options.controller, options.successStatusCode, options.getParams))
  }

  /**
   * POST route method
   *
   * @param {RouterConfiguration} options Options object
   * @see {@link Express.Router.post} for further information.
   */
  post(options) {
    this.router.post(options.path, this.getRoute(options.controller, options.successStatusCode, options.getParams))
  }

  /**
   * PUT route method
   *
   * @param {RouterConfiguration} options Options object
   * @see {@link Express.Router.put} for further information.
   */
  put(options) {
    this.router.put(options.path, this.getRoute(options.controller, options.successStatusCode, options.getParams))
  }

  /**
   * DELETE route method
   *
   * @param {RouterConfiguration} options Options object
   * @see {@link Express.Router.delete} for further information.
   */
  delete(options) {
    this.router.delete(options.path, this.getRoute(options.controller, options.successStatusCode, options.getParams))
  }
}
