import { PATH_REGEX } from '../__constants__'

import InvalidArgument from '../errors/InvalidArgument'
import RouterElement from './RouterElement'

export default class Route extends RouterElement {
  constructor(name, config) {
    super(Route, ['name', 'path', 'query', 'methods'], config)

    // Valid configuration
    if (!config) {
      throw new InvalidArgument(`Root ${this.name} can not be null or undefined.`)
    }

    this.name = String(name)
    this.path = config.path

    // Valid path
    if (!PATH_REGEX.test(this.root)) {
      throw new InvalidArgument(`${this.root} is not a valid path (using regex: ${PATH_REGEX}).`)
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
