import '../__typesdef__.js'
import { PATH_REGEX } from '../__constants__.js'

import { join } from 'path'
import colors from 'colors'

import InvalidArgument from '../errors/InvalidArgument.js'
import EmptyRoutes from '../errors/EmptyRoutes.js'
import RouterElementMiddleware from './RouterElementMiddleware.js'

import Parser from '../Parser.js'
import RouteParameter from './RouteParameter.js'

/** Root element of the custom router. */
export default class Root extends RouterElementMiddleware {
  /**
   * Parse a root object
   *
   * @param {string} name Root name
   * @param {RootObject} config Root configuration
   * @param {ParserConfig} parserConfig Parser configuration
   * @param {[RouteParameter]} extraQuery Root query parameters
   */
  constructor(name, config, parserConfig, extraQuery = []) {
    super(Root, ['name', 'root', 'query', 'routes'], config)

    this.name = String(name)
    this.root = ''
    this.query = extraQuery
    this.routes = []

    this.__parseRoot(config.root)
    this.__parseQueryParameters(config.query)
    this.__parseRoutes(config.routes, parserConfig)
  }

  /**
   * Parse root parameter
   *
   * @param {string} root Root root
   */
  __parseRoot(root) {
    if (!root || !PATH_REGEX.test(root)) {
      throw new InvalidArgument(`Root.root="${root}" is not a valid path (using regex: ${PATH_REGEX}).`)
    }
    this.root = root
  }

  /**
   * Parse query parameters
   *
   * @param {[RouteParameterObject]} query List of parameters
   */
  __parseQueryParameters(query) {
    if (query) {
      if (Array.isArray(query) || !(query instanceof Object)) {
        throw new InvalidArgument(`${this.name}.query=${query} is not an dictionnary.`)
      }
      this.query = this.query.concat(
        Object.keys(query).map(key => {
          const param = {
            type: query[key],
          }
          return new RouteParameter(key, param)
        }),
      )
    }
  }

  /**
   * Parse root routes
   *
   * @param {[RouteObject]} routes List of routes objects
   * @param {ParserConfig} parserConfig Parser configuration
   */
  __parseRoutes(routes, parserConfig) {
    if (routes && !(routes instanceof Object)) {
      throw new InvalidArgument(`${this.name}.routes=${routes} is not an dictionnary.`)
    }
    if (!routes || Object.keys(routes).length === 0) {
      throw new EmptyRoutes()
    }
    this.routes = Parser.__parseRouteElements(routes, parserConfig, this.query)
  }

  /**
   * Load sub root and routes from name and parser configuration.
   *
   * @param {Router} router Express router
   * @param {string} path Middleware path
   * @param {ParserConfig} config Parser configuration
   */
  async load(router, path, config) {
    const rootPath = join(path, this.root)
    await this.__loadPreMiddlewares(router, rootPath, config.middleware_dir)
    for (const route of this.routes) {
      await route.load(router, rootPath, config)
    }
    await this.__loadPostMiddlewares(router, rootPath, config.middleware_dir)
  }

  /**
   * Make readable this object
   *
   * @returns {string} Instance description
   */
  toString() {
    let res = `${colors.red(this.root)} (${this.name})\n`
    for (const route of this.routes) {
      res += `${route.toString().replace(/^(?!\s*$)/gm, '  ')}\n`
    }
    return res.slice(0, -1)
  }
}
