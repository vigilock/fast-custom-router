import { join } from 'path'

import Express from 'express'

import InvalidArgument from '../errors/InvalidArgument'
import MiddlewareNotFound from '../errors/MiddlewareNotFound'

/** Middleware element for custom router. */
export default class Middleware {
  /**
   * Instanciate Middleware object
   *
   * @param {string} name Middleware name
   */
  constructor(name) {
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
   * @param {string} middlewareDir Controller directory
   */
  async __loadMiddleware(middlewareDir) {
    const middlewarePath = join(middlewareDir, this.name + '.js')
    try {
      const module = await import(middlewarePath)
      this.middleware = module.default
    } catch (error) {
      throw new MiddlewareNotFound(middlewarePath)
    }
  }

  /**
   * Load middleware from name and parser configuration
   *
   * @param {Express.Router} router Express router
   * @param {string} path Middleware path
   * @param {string} middlewareDir Controller directory
   */
  async load(router, path, middlewareDir) {
    await this.__loadMiddleware(middlewareDir)
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
