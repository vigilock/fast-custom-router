import { PATH_REGEX } from '../__constants__'

import Middleware from './Middleware'
import RouteMethod from './RouteMethod'

import InvalidArgument from '../errors/InvalidArgument'
import RouterElement from './RouterElement'
import EmptyMethods from '../errors/EmptyMethods'

/**
 * Route element of the custom router.
 */
export default class Route extends RouterElement {
  /**
   * Instanciate Route object
   * @param {String} name name of the route
   * @param {RouteObject} config route configuration
   */
  constructor(name, config) {
    super(Route, ['name', 'path', 'query', 'pre_middlewares', 'post_middlewares', 'methods'], config)

    // Valid configuration
    if (!config) {
      throw new InvalidArgument(`Root ${name} can not be null or undefined.`)
    }

    this.name = String(name)
    this.path = config.path
    this.query = []
    this.pre_middlewares = []
    this.post_middlewares = []

    // Valid path
    if (!this.path || !PATH_REGEX.test(this.path)) {
      throw new InvalidArgument(`${this.root} is not a valid path (using regex: ${PATH_REGEX}).`)
    }

    // Valid query parameters

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
     * Valid and create methods
     */
    if (config.methods && !(config.methods instanceof Object)) {
      throw new InvalidArgument(`${this.name}.methods=${config.methods} is not an dictionnary.`)
    }
    if (!config.methods || config.methods.length === 0) {
      throw new EmptyMethods(this.name)
    }
    this.methods = Object.keys(config.methods).map(key => {
      return new RouteMethod(key, config.methods[key])
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
    return `<Route name="${this.name}" path="${this.path}">`
  }
}
