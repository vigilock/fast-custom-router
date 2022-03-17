import { PATH_REGEX } from '../__constants__.js'

import { join } from 'path'
import * as colors from 'colors'

import RouteMethod from './RouteMethod.js'

import InvalidArgument from '../errors/InvalidArgument.js'
import EmptyMethods from '../errors/EmptyMethods.js'
import RouterElementMiddleware from './RouterElementMiddleware.js'
import RouteParameter from './RouteParameter.js'

/** Route element of the custom router. */
export default class Route extends RouterElementMiddleware {
  /**
   * Instanciate Route object
   *
   * @param {string} name Name of the route
   * @param {RouteObject} config Route configuration
   * @param {RouteParameter[]} [extraParams=[]] Root params parameters
   */
  constructor(name, config, extraParams = []) {
    super(Route, ['name', 'path', 'params', 'methods'], config)

    this.name = String(name)
    this.path = config.path
    this.params = extraParams
    /** @type {RouteMethod[]} */
    this.methods = []

    this.__parsePath(config.path)
    this.__parseParams(config.params)
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
   * Parse params parameters
   *
   * @param {RouteParameterObject[]} params List of parameters
   * @throws {InvalidArgument}
   * @returns {RouteMethod}
   */
  __parseParams(params) {
    if (params) {
      if (Array.isArray(params) || !(params instanceof Object)) {
        throw new InvalidArgument(`${this.name}.params=${params} is not an dictionnary.`)
      }
      this.params = this.params.concat(Object.keys(params).map(key => new RouteParameter(key, params[key])))
    }
  }

  /**
   * Parse uri methods.
   *
   * @param {RouteMethodObject} methods Route methods
   * @throws {InvalidArgument}
   * @throws {EmptyMethods}
   * @returns {RouteMethod}
   */
  __parseMethods(methods) {
    if (methods && !(methods instanceof Object)) {
      throw new InvalidArgument(`${this.name}.methods=${methods} is not an dictionnary.`)
    }
    if (!methods || Object.keys(methods).length === 0) {
      throw new EmptyMethods(this.name)
    }
    this.methods = Object.keys(methods).map(key => {
      if (typeof methods[key] === 'string') {
        return new RouteMethod(key, { controller: methods[key], params: this.params })
      }
      return new RouteMethod(key, { ...methods[key], params: this.params })
    })
  }

  /**
   * Load routes from name and parser configuration.
   *
   * @param {Router} router Express router
   * @param {string} path Middleware path
   * @param {ParserConfig} config Parser configuration
   * @returns {Promise<void>}
   */
  async load(router, path, config) {
    const routePath = join(path, this.path)
    const prePromises = []
    for (let i = 0; i < this.pre_middlewares.length; i++) {
      const middleware = this.pre_middlewares[i]
      prePromises.push(middleware.__loadModule(middleware.name, config.middleware_dir))
    }
    const preMiddlewares = await Promise.all(prePromises)
    const postPromises = []
    for (let i = 0; i < this.post_middlewares.length; i++) {
      const middleware = this.post_middlewares[i]
      postPromises.push(middleware.__loadModule(middleware.name, config.middleware_dir))
    }
    const postMiddlewares = await Promise.all(postPromises)
    for (const method of this.methods) {
      await method.load(router, routePath, config, preMiddlewares, postMiddlewares)
    }
  }

  /**
   * Make readable this object
   *
   * @returns {string} Instance description
   */
  toString() {
    let output = []
    for (const middleware of this.pre_middlewares) {
      output.push(`<${middleware.toString()}>`)
    }
    let res = `${colors.blue(this.path)} (${this.name})`
    for (const method of this.methods) {
      if (!method.abstract) {
        res += ` ~${colors.magenta(method.name.toUpperCase())}~`
      } else {
        res += ` ${colors.magenta(method.name.toUpperCase())}`
      }
    }
    output.push(res)
    for (const middleware of this.post_middlewares) {
      output.push(`<${middleware.toString()}>`)
    }
    return output.join('\n')
  }
}
