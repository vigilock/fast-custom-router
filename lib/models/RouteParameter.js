import '../__typesdef__.js'

import InvalidArgument from '../errors/InvalidArgument.js'

import RouterElement from './RouterElement.js'
import Validation from '../Validation.js'
import ValidationDataError from '../errors/ValidationData.js'

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
    super(RouteParameter, ['type', 'default_value'], typeof config === 'string' ? {} : config)

    this.name = name
    /** @type {RegExp | Function} */
    this.type = undefined
    this.optionnal = false
    this.default_value = undefined

    this.__parseName(name)
    if (typeof config === 'string') {
      this.__parseType(config)
    } else {
      this.__parseType(config.type)
      this.__parseDefaultValue(config.default_value)
    }
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
      if (default_value === null) {
        this.default_value = null
      } else if (default_value === undefined || default_value === '') {
        this.default_value = undefined
      } else {
        this.default_value = this.type(default_value)
      }
    }
  }

  /**
   * Valid data on request.
   *
   * @param {any} value Value to be valided
   * @returns {any} Valided value
   */
  valid(value) {
    if ((value === undefined || value === null) && this.optionnal) {
      return this.default_value
    }
    try {
      if (typeof this.type === 'function' ) {
        if((value === undefined || value === null)) {
          throw {
            code: 400,
            message: `'${this.name}' is mandatory.`,
          }
        }
        return this.type(value)
      } else if (this.type instanceof RegExp) {
        if (!this.type.test(value)) {
          throw {
            code: 400,
            message: `'${value}' doesn't match ${this.type} regex.`,
          }
        }
      } else {
        throw {
          code: 500,
          message: `'${value}' validation failed.`,
        }
      }
    } catch (error) {
      throw new ValidationDataError(
        error.code,
        'invalidParameter',
        `Parameter "${this.name}" cannot be valided (Reason: ${error.message})`,
      )
    }
  }
}
