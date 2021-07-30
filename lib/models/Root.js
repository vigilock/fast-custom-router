import '../__typesdef__.js'
import { PATH_REGEX } from '../__constants__.js'

import { join } from 'path'
import colors from 'colors'

import InvalidArgument from '../errors/InvalidArgument.js'
import EmptyRoutes from '../errors/EmptyRoutes.js'
import RouterElementMiddleware from './RouterElementMiddleware.js'

import Parser from '../Parser.js'

/** Root element of the custom router. */
export default class Root extends RouterElementMiddleware {
  /**
   * Parse a root object
   *
   * @param {string} name Root name
   * @param {RootObject} config Root configuration
   * @param {ParserConfig} parserConfig Parser configuration
   */
  constructor(name, config, parserConfig) {
    super(Root, ['name', 'root', 'routes', 'routes'], config)

    this.name = String(name)
    this.root = ''
    this.routes = []

    this.__parseRoot(config.root)
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
    this.routes = Parser.__parseRouteElements(routes, parserConfig)
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
