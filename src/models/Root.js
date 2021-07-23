import '../__typesdef__'
import { PATH_REGEX } from '../__constants__'

import Middleware from './Middleware'
import Route from './Route'
import RouterElement from './RouterElement'

import InvalidArgument from '../errors/InvalidArgument'
import InvalidRouteElement from '../errors/InvalidRouteElement'
import EmptyRoutes from '../errors/EmptyRoutes'

/**
 * Root element of the custom router.
 */
export default class Root extends RouterElement {
  /**
   * Parse a root object
   * @param {String} name root name
   * @param {RootObject} config root configuration
   */
  constructor(name, config) {
    super(Root, ['name', 'root', 'routes', 'pre_middlewares', 'post_middlewares', 'routes'], config)
    // Valid configuration
    if (!config) {
      throw new InvalidArgument(`Root ${name} config can not be null or undefined.`)
    }

    this.name = String(name)
    this.root = String(config.root)
    this.pre_middlewares = []
    this.post_middlewares = []

    if (!this.root || !PATH_REGEX.test(this.root)) {
      throw new InvalidArgument(`Root.root="${this.root}" is not a valid path (using regex: ${PATH_REGEX}).`)
    }

    /**
     * Valid and create pre-middlewares
     */
    if (config.pre_middlewares && !(config.pre_middlewares instanceof Array)) {
      throw new InvalidArgument(`${this.name}.pre_middlewares=${config.pre_middlewares} is not an dictionnary.`)
    }
    if (config.pre_middlewares) {
      this.pre_middlewares = config.pre_middlewares.map(middleware => {
        return new Middleware(middleware)
      })
    }

    /**
     * Valid and create routes
     */
    if (config.routes && !(config.routes instanceof Object)) {
      throw new InvalidArgument(`${this.name}.routes=${config.routes} is not an dictionnary.`)
    }
    if (!config.routes || config.routes.length === 0) {
      throw new EmptyRoutes()
    }
    this.routes = Object.keys(config.routes).map(key => {
      const el = config.routes[key]
      if (el.root) {
        return new Root(key, el)
      } else if (el.path) {
        return new Route(key, config.routes[key])
      } else {
        throw new InvalidRouteElement(`${key} is no recongnized as a Root or as a Route.`)
      }
    })

    /**
     * Valid and create post-middlewares
     */
    if (config.post_middlewares && !(config.post_middlewares instanceof Array)) {
      throw new InvalidArgument(`${this.name}.post_middlewares=${config.post_middlewares} is not an dictionnary.`)
    }
    if (config.post_middlewares) {
      this.post_middlewares = config.post_middlewares.map(middleware => {
        return new Middleware(middleware)
      })
    }
  }

  /**
   * Make readable this object
   * @returns {String} instance description
   */
  toString() {
    let res = `<Root name="${this.name}" root="${this.root}">\n`
    this.routes.forEach(route => {
      res += '  ' + route.toString() + '\n'
    })
    res += '</Root>'
    return res
  }
}
