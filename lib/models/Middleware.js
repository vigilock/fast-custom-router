import InvalidArgument from '../errors/InvalidArgument'

import RouterElement from './RouterElement'

/** Middleware element for custom router. */
export default class Middleware extends RouterElement {
  /**
   * Instanciate Middleware object
   *
   * @param {string} name Middleware name
   */
  constructor(name) {
    super(Middleware, [], {})

    this.name = undefined
    this.middleware = undefined

    this.__parseName(name)
  }

  /**
   * Parse middleware name.
   *
   * @param {string} name Middleware name
   */
  __parseName(name) {
    if (!name || typeof name !== 'string') {
      throw new InvalidArgument(`Middleware.name="${name}" must be a String.`)
    }
    this.name = name
  }

  /**
   * Load middleware from name and parser configuration
   *
   * @param {Router} router Express router
   * @param {string} path Middleware path
   * @param {string} middlewareDir Controller directory
   */
  async load(router, path, middlewareDir) {
    this.middleware = await this.__loadModule(this.name, middlewareDir)
    router.use(path, this.middleware)
  }

  /**
   * Make readable this object
   *
   * @returns {string} Instance description
   */
  toString() {
    return `<Middleware name="${this.name}">`
  }
}
