import InvalidArgument from '../errors/InvalidArgument'

/** Middleware element for custom router. */
export default class Middleware {
  /**
   * Instanciate Middleware object
   *
   * @param {string} name Middleware name
   */
  constructor(name) {
    this.name = undefined

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
   * Make readable this object
   *
   * @returns {string} Instance description
   */
  toString() {
    return `<Middleware name="${this.name}">`
  }
}
