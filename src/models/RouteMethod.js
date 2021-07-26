import '../__typesdef__'
import { ACCEPTED_METHODS, HTTP_RESPONSE_CODE, HTTP_DEFAULT_RESPONSE_CODE } from '../__constants__'

import { join } from 'path'

import ControllerNotFound from '../errors/ControllerNotFound'
import InvalidArgument from '../errors/InvalidArgument'

import RouteParameter from './RouteParameter'
import RouterElementMiddleware from './RouterElementMiddleware'

/** Route method of a Route. */
export default class RouteMethod extends RouterElementMiddleware {
  /**
   * Intanciate RouteMethod object.
   *
   * @param {RequestMethod} method Route method
   * @param {RouteMethodObject} config Route configuration
   */
  constructor(method, config) {
    super(RouteMethod, ['controller', 'response_code', 'body'], config)

    this.name = String(method)
    this.controller_name = config.controller
    this.controller = undefined
    this.response_code = undefined
    this.body = []

    this.__parseMethod(method)
    this.__parseControllerName(config.controller)
    this.__parseResponseCode(config.response_code)
    this.__parseBody(config.body)
  }

  /**
   * Parse method name.
   *
   * @param {string} method HTTP method
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
   * Parse body arguments.
   *
   * @param {{ string: { type: string; default_value: any } }} body Body arguments
   */
  __parseBody(body) {
    if (body) {
      if (Array.isArray(body) || !(body instanceof Object)) {
        throw new InvalidArgument(`${this.name}.body=${body} is not a dictionnary.`)
      }
      this.body = Object.keys(body).map(key => {
        return new RouteParameter(key, body[key])
      })
    }
  }

  /**
   * Load controller from name and parser configuration
   *
   * @param {string} controllerDir Controller directory
   */
  async loadController(controllerDir) {
    const controllerPath = join(controllerDir, this.controller_name + '.js')
    try {
      const module = await import(controllerPath)
      this.controller = module.default
    } catch (error) {
      throw new ControllerNotFound(controllerPath)
    }
  }
}
