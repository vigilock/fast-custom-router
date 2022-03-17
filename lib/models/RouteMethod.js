import '../__typesdef__.js'
import { ACCEPTED_METHODS, HTTP_RESPONSE_CODE, HTTP_DEFAULT_RESPONSE_CODE, CUSTOM_ARG_NAME } from '../__constants__.js'

import InvalidArgument from '../errors/InvalidArgument.js'

import RouteParameter from './RouteParameter.js'
import RouterElement from './RouterElement.js'
import Middleware from './Middleware.js'

/** Route method of a Route. */
export default class RouteMethod extends RouterElement {
  /**
   * Intanciate RouteMethod object.
   *
   * @param {RequestMethod} method Route method
   * @param {RouteMethodObject} config Route configuration
   */
  constructor(method, config) {
    super(RouteMethod, ['controller', 'response_code', 'abstract', 'params', 'body'], config)

    this.name = String(method)
    this.controller_name = config.controller
    this.controller = undefined
    this.response_code = undefined
    this.abstract = undefined
    /** @type {RouteParameter[]} */
    this.params = config.params
    /** @type {RouteParameter[]} */
    this.body = []

    this.__parseMethod(method)
    this.__parseControllerName(config.controller)
    this.__parseResponseCode(config.response_code)
    this.__parseAbstract(config.abstract)
    this.__parseBody(config.body)
  }

  /**
   * Parse method name.
   *
   * @param {string} method HTTP method
   * @throws {InvalidArgument}
   */
  __parseMethod(method) {
    const method_name = String(method).toUpperCase()
    if (ACCEPTED_METHODS.indexOf(method_name) === -1) {
      throw new InvalidArgument(`Router does not provide "${method_name}" method`)
    }
  }

  /**
   * Parse controller name.
   *
   * @param {string} controller Controller name
   * @throws {InvalidArgument}
   */
  __parseControllerName(controller) {
    if (!controller) {
      throw new InvalidArgument(`${this.name}.controller=${controller} is undefined.`)
    }
  }

  /**
   * Parse HTTP response code for success controller response.
   *
   * @param {number} code Default HTTP response code
   * @throws {InvalidArgument}
   */
  __parseResponseCode(code) {
    this.response_code = HTTP_DEFAULT_RESPONSE_CODE
    if (code) {
      if (HTTP_RESPONSE_CODE.indexOf(code) === -1) {
        throw new InvalidArgument(`${code} is not a valid HTTP response code.`)
      }
      this.response_code = code
    }
  }

  /**
   * Parse abstract flag for controller call.
   *
   * @param {boolean} abstract Abstract or not
   */
  __parseAbstract(abstract) {
    this.abstract = true
    if (typeof abstract === 'boolean') {
      this.abstract = abstract
    } else if (typeof abstract === 'string' && abstract === 'no') {
      this.abstract = false
    }
  }

  /**
   * Parse body arguments.
   *
   * @param {{ string: { type: string; default_value: any } }} body Body arguments
   * @throws {InvalidArgument}
   * @returns {void}
   */
  __parseBody(body) {
    if (body) {
      if (Array.isArray(body) || !(body instanceof Object)) {
        throw new InvalidArgument(`${this.name}.body=${body} is not an dictionnary.`)
      }
      this.body = Object.keys(body).map(key => {
        return new RouteParameter(key, body[key])
      })
    }
  }

  /**
   * Get valided params parameters.
   *
   * @param {Request} req Express request
   * @returns {object} Params parameters
   */
  __getParams(req) {
    const res = {}
    this.params.forEach(param => {
      res[param.name] = param.valid(req.params[param.name])
    })
    return res
  }

  /**
   * Get valided body parameters.
   *
   * @param {Request} req Express request
   * @returns {object} Body parameters
   */
  __getBody(req) {
    const res = {}
    this.body.forEach(param => {
      res[param.name] = param.valid(req.body[param.name])
    })
    return res
  }

  /**
   * Give route function.
   *
   * @param {Function} controller Route controller
   * @param {number} statusCode HTTP response code
   * @returns {Function} Route function
   */
  __getRoute(controller, statusCode) {
    if (!this.abstract) {
      return controller
    }
    return async (req, res, next) => {
      let code = statusCode
      const setStatus = newStatusCode => {
        if (typeof newStatusCode !== 'number') {
          throw new InvalidArgument(`"${newStatusCode}" (type: ${typeof newStatusCode}) is not a valid HTTP response code.`)
        }
        code = newStatusCode
      }
      try {
        const result = await controller({
          body: this.__getBody(req),
          headers: req.headers,
          params: this.__getParams(req),
          query: req.query,
          status: setStatus,
          ...req[CUSTOM_ARG_NAME],
        })
        res.status(code)
        if (result) {
          res.json(result)
        } else {
          res.send()
        }
      } catch (error) {
        next(error)
      }
    }
  }

  /**
   * Load controller from name and parser configuration.
   *
   * @param {Router} router Express router
   * @param {string} path Middleware path
   * @param {ParserConfig} config Parser configuration
   * @param {Middleware[]} preMiddlewares Pre-middlewares
   * @param {Middleware[]} postMiddlewares Post-middlewares
   */
  async load(router, path, config, preMiddlewares = [], postMiddlewares = []) {
    this.controller = await this.__loadModule(this.controller_name, config.controller_dir)
    const route = this.__getRoute(this.controller, this.response_code)
    router[this.name.toLowerCase()](path, ...preMiddlewares, route, ...postMiddlewares)
  }
}
