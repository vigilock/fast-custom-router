import '../__typesdef__'
import { ACCEPTED_METHODS } from '../__constants__'

import InvalidArgument from '../errors/InvalidArgument'

import Middleware from './Middleware'
import RouterElement from './RouterElement'

/**
 * Route method of a Route.
 */
export default class RouteMethod extends RouterElement {
  /**
   * Intanciate RouteMethod object.
   * @param {RequestMethod} method
   */
  constructor(method, config) {
    super(RouteMethod, ['controller', 'response_code', 'pre_middlewares', 'post_middlewares', 'body'], config)

    this.method = String(method).toUpperCase()

    if (ACCEPTED_METHODS.indexOf(this.method) === -1) {
      throw new InvalidArgument(`Router does not provide "${this.method}" method`)
    }
    // Valid configuration
    if (!config) {
      throw new InvalidArgument(`RouteMethod ${method} can not be null or undefined.`)
    }

    this.name = String(method)
    this.controller = config.controller
    this.body = []
    this.pre_middlewares = []
    this.post_middlewares = []

    /**
     * TODO: controller, response_code
     */

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

    /**
     * Valid and create body arguments
     */
    if (config.body && !(config.body instanceof Object)) {
      throw new InvalidArgument(`${this.name}.post_middlewares=${config.post_middlewares} is not an dictionnary.`)
    }
    if (config.body) {
      this.body = Object.key(config.body).map(key => {
        return new RouteParameter(key, config.body[key])
      })
    }
  }
}
