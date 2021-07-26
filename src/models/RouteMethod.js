import '../__typesdef__'
import { ACCEPTED_METHODS } from '../__constants__'

import { join } from 'path'

import ControllerNotFound from '../errors/ControllerNotFound'
import InvalidArgument from '../errors/InvalidArgument'

import Middleware from './Middleware'
import RouteParameter from './RouteParameter'
import RouterElement from './RouterElement'

/** Route method of a Route. */
export default class RouteMethod extends RouterElement {
  /**
   * Intanciate RouteMethod object.
   *
   * @param {RequestMethod} method Route method
   * @param {RouteMethod} config Route configuration
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
    this.controller_name = config.controller
    this.controller = undefined
    this.body = []
    this.pre_middlewares = []
    this.post_middlewares = []

    /** TODO: response_code */
    /** Load controller from config.controller string */
    if (!config.controller) {
      throw new InvalidArgument(`${this.name}.controller=${config.pre_middlewares} is undefined.`)
    }

    /** Valid and create pre-middlewares */
    if (config.pre_middlewares) {
      if (!(config.pre_middlewares instanceof Array)) {
        throw new InvalidArgument(`${this.name}.pre_middlewares=${config.pre_middlewares} is not an dictionnary.`)
      }
      this.pre_middlewares = config.pre_middlewares.map(middleware => {
        return new Middleware(middleware)
      })
    }

    /** Valid and create post-middlewares */
    if (config.post_middlewares) {
      if (!(config.post_middlewares instanceof Array)) {
        throw new InvalidArgument(`${this.name}.post_middlewares=${config.post_middlewares} is not an dictionnary.`)
      }
      this.post_middlewares = config.post_middlewares.map(middleware => {
        return new Middleware(middleware)
      })
    }

    /** Valid and create body arguments */
    if (config.body) {
      if (Array.isArray(config.body) || !(config.body instanceof Object)) {
        throw new InvalidArgument(`${this.name}.post_middlewares=${config.post_middlewares} is not an dictionnary.`)
      }
      this.body = Object.keys(config.body).map(key => {
        return new RouteParameter(key, config.body[key])
      })
    }
  }

  /**
   * Load controller from name and parser configuration
   *
   * @param {String} controllerDir Controller directory
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
