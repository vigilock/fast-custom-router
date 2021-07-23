import RouterElement from './RouterElement'

export default class RouteParameter extends RouterElement {
  /**
   * Instanciate RouteParameter object
   * @param {String} name name of the parameter
   * @param {RouteObject} config parameter configuration
   */
  constructor(name, config) {
    super(RouteParameter, ['type', 'default_value'], config)
  }
}
