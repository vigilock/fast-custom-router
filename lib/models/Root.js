import '../__typesdef__.js'
import { PATH_REGEX } from '../__constants__.js'

import { join } from 'path'
import colors from 'colors'

import InvalidArgument from '../errors/InvalidArgument.js'
import EmptyRoutes from '../errors/EmptyRoutes.js'
import RouterElementMiddleware from './RouterElementMiddleware.js'

import Parser from '../Parser.js'
import RouteParameter from './RouteParameter.js'
import { padStartText } from '../util/StringUtil.js'
import Import from './Import.js'

/** Root element of the custom router. */
export default class Root extends RouterElementMiddleware {
  /**
   * Parse a root object
   *
   * @param {string} name Root name
   * @param {RootObject} config Root configuration
   * @param {ParserConfig} parserConfig Parser configuration
   * @param {[RouteParameter]} extraParams Root params parameters
   */
  constructor(name, config, parserConfig, extraParams = []) {
    super(Root, ['name', 'root', 'params', 'routes'], config)

    this.name = String(name)
    this.root = ''
    this.params = extraParams
    /** @type {[Root]} */
    this.routes = []

    this.__parseRoot(config.root)
    this.__parseParams(config.params)
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
   * Parse params parameters
   *
   * @param {[RouteParameterObject]} params List of parameters
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
    this.routes = Parser.__parseRouteElements(routes, parserConfig, this.params)
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
    let head = `${colors.red(this.root)} (${this.name})\n`
    let body = []
    const lastElement = this.routes[this.routes.length - 1]
    for (const route of this.routes) {
      let routeString = route.toString()
      let firstChar = ''
      if (route === lastElement) {
        firstChar = '└'
      } else {
        firstChar = '├'
        let first = true
        if (route instanceof Root) {
          routeString = routeString
            .split('\n')
            .map(l => {
              if (first) {
                first = false
                return l
              } else {
                return '│' + l
              }
            })
            .join('\n')
        }
      }
      if (route instanceof Import) {
        body.push(routeString)
      } else {
        body.push(firstChar + '── ' + routeString)
      }
    }
    body = padStartText(body.join('\n'), ' ', 3)

    return head + body
  }
}
