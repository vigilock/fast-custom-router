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

    if (!config) {
      throw new InvalidArgument(`RouteParameter "${name}" configuration can not be null or undefined.`)
    }

    this.name = name
    this.type = null
    this.default_value = config.default_value

    if (!name || typeof name !== 'string') {
      throw new InvalidArgument(`RouterParameter does not provide valid name "${this.name}"`)
    }

    const type = String(config.type).toUpperCase()
    if (!config.type || Object.keys(Validation).indexOf(type) === -1) {
      throw new InvalidArgument(`RouterParameter "${this.name}" does not provide valid type "${type}"`)
    } else {
      this.type = Validation[type]
    }
  }
}
