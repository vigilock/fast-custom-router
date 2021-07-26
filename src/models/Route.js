import { PATH_REGEX } from '../__constants__'

import RouteMethod from './RouteMethod'

import InvalidArgument from '../errors/InvalidArgument'
import EmptyMethods from '../errors/EmptyMethods'
import RouterElementMiddleware from './RouterElementMiddleware'

/** Route element of the custom router. */
export default class Route extends RouterElementMiddleware {
  /**
   * Instanciate Route object
   *
   * @param {string} name Name of the route
   * @param {RouteObject} config Route configuration
   */
  constructor(name, config) {
    super(Route, ['name', 'path', 'query', 'methods'], config)

    this.name = String(name)
    this.path = config.path
    this.query = []

    this.__parsePath(config.path)
    this.__parseQueryParameters(config.query)
    this.__parseMethods(config.methods)
  }

  /**
   * Parse uri path.
   *
   * @param {string} path Uri path
   */
  __parsePath(path) {
    if (!path || !PATH_REGEX.test(path)) {
      throw new InvalidArgument(`${path} is not a valid path (using regex: ${PATH_REGEX}).`)
    }
    this.path = path
  }

  /**
   * Parse query parameters
   *
   * @param {[RouteParameterObject]} query List of parameters
   */
  __parseQueryParameters(query) {
    // TODO: Valid query parameters
  }

  /**
   * Parse uri methods.
   *
   * @param {RouteMethodObject} methods Route methods
   */
  __parseMethods(methods) {
    if (methods && !(methods instanceof Object)) {
      throw new InvalidArgument(`${this.name}.methods=${methods} is not a dictionnary.`)
    }
    if (!methods || Object.keys(methods).length === 0) {
      throw new EmptyMethods(this.name)
    }
    this.methods = Object.keys(methods).map(key => {
      return new RouteMethod(key, methods[key])
    })
  }

  /**
   * Make readable this object
   *
   * @returns {string} Instance description
   */
  toString() {
    return `<Route name="${this.name}" path="${this.path}">`
  }
}
