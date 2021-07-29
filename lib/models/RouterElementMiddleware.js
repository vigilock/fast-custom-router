import Middleware from './Middleware.js'
import RouterElement from './RouterElement.js'

import InvalidArgument from '../errors/InvalidArgument.js'

/** Check if child element has unused arguments. */
export default class RouterElementMiddleware extends RouterElement {
  /**
   * Check if child element has unused arguments and middlewares.
   *
   * @param {RouterElement} child Child of this class
   * @param {any} params Used params
   * @param {any} config Child configuration
   */
  constructor(child, params = [], config) {
    super(child, [...params, 'pre_middlewares', 'post_middlewares'], config)

    this.pre_middlewares = this.__parseMiddlewares(config.pre_middlewares)
    this.post_middlewares = this.__parseMiddlewares(config.post_middlewares)
  }

  /**
   * Check if middlewares are valid.
   *
   * @param {[string]} middlewares Middleware list
   * @returns {[Middleware]} List of middleware objects
   */
  __parseMiddlewares(middlewares) {
    if (middlewares) {
      if (!(middlewares instanceof Array)) {
        throw new InvalidArgument(`${this.child.name}.middlewares=${middlewares} is not an dictionnary.`)
      }
      return middlewares.map(middleware => {
        return new Middleware(middleware)
      })
    }
    return []
  }

  /**
   * Load middlewares
   *
   * @param {[Middleware]} middlewares List of middlewares
   * @param {Router} router Express router
   * @param {string} path URI path
   * @param {string} middlewareDir Middleware directory path
   */
  async __loadMiddlewares(middlewares, router, path, middlewareDir) {
    /** @type {Middleware} */
    for (const middleware of middlewares) {
      await middleware.load(router, path, middlewareDir)
    }
  }

  /**
   * Load pre middlewares
   *
   * @param {Router} router Express router
   * @param {string} path URI path
   * @param {string} middlewareDir Middleware directory path
   */
  async __loadPreMiddlewares(router, path, middlewareDir) {
    await this.__loadMiddlewares(this.pre_middlewares, router, path, middlewareDir)
  }

  /**
   * Load post middlewares
   *
   * @param {Router} router Express router
   * @param {string} path URI path
   * @param {string} middlewareDir Middleware directory path
   */
  async __loadPostMiddlewares(router, path, middlewareDir) {
    await this.__loadMiddlewares(this.post_middlewares, router, path, middlewareDir)
  }
}
