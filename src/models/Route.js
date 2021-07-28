import { PATH_REGEX } from '../__constants__'

import Express from 'express'

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
    /** @type {[RouteMethod]} */
    this.methods = []

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
      throw new InvalidArgument(`${this.name}.methods=${methods} is not an dictionnary.`)
    }
    if (!methods || Object.keys(methods).length === 0) {
      throw new EmptyMethods(this.name)
    }
    this.methods = Object.keys(methods).map(key => {
      return new RouteMethod(key, methods[key])
    })
  }

  /**
   * Load routes from name and parser configuration.
   *
   * @param {Express.Router} router Express router
   * @param {string} path Middleware path
   * @param {ParserConfig} config Parser configuration
   */
  async load(router, path, config) {
    const routePath = path + this.path
    await this.__loadPreMiddlewares(router, routePath, config.middleware_dir)
    for (let i = 0; i < this.methods.length; i++) {
      await this.methods[i].load(router, routePath, config)
    }
    await this.__loadPostMiddlewares(router, routePath, config.middleware_dir)
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
