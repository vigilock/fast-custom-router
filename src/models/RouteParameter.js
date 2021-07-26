import '../__typesdef__'

import InvalidArgument from '../errors/InvalidArgument'

import RouterElement from './RouterElement'
import Validation from '../Validation'

/**
 * Route parameter.
 *
 * It is a body resquest as req.params.id.
 */
export default class RouteParameter extends RouterElement {
  /**
   * Instanciate RouteParameter object
   *
   * @param {string} name Name of the parameter
   * @param {RouteParameterObject} config Parameter configuration
   */
  constructor(name, config) {
    super(RouteParameter, ['type', 'default_value'], config)

    this.name = name
    this.type = undefined
    this.optionnal = false
    this.default_value = undefined

    this.__parseName(name)
    this.__parseType(config.type)
    this.__parseDefaultValue(config.default_value)
  }

  /**
   * Parse name.
   *
   * @param {string} name Parameter name
   */
  __parseName(name) {
    if (!name || typeof name !== 'string') {
      throw new InvalidArgument(`RouterParameter does not provide valid name "${this.name}"`)
    }
  }

  /**
   * Parse parameter type.
   *
   * @param {string} type Type name
   */
  __parseType(type) {
    const typeString = String(type).toUpperCase()
    if (!type || Object.keys(Validation).indexOf(typeString) === -1) {
      throw new InvalidArgument(`RouterParameter "${this.name}" does not provide valid type "${type}"`)
    } else {
      this.type = Validation[typeString]
    }
  }

  /**
   * Parse default value for parameter.
   *
   * @param {any} default_value Default value
   */
  __parseDefaultValue(default_value) {
    if (typeof default_value !== 'undefined') {
      this.optionnal = true
      this.default_value = this.type(default_value)
    }
  }
}
