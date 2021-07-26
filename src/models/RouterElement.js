import InvalidArgument from '../errors/InvalidArgument'

/** Check if child element has unused arguments. */
export default class RouterElement {
  /**
   * Check if child element has unused arguments.
   *
   * @param {RouterElement} child Child of this class
   * @param {any} params Used params
   * @param {any} config Child configuration
   */
  constructor(child, params = [], config) {
    this.child = child

    this.__parseEmptyConfig(config)
    this.__parseUnusedArguments(params, config)
  }

  /**
   * Check if config is defined.
   *
   * @param {object} config Router element configuration
   */
  __parseEmptyConfig(config) {
    if (!config) {
      throw new InvalidArgument(`${this.child.name} configuration is undefined.`)
    }
  }

  /**
   * Check if configuration has unused options.
   *
   * @param {[string]} params List of configuration option name
   * @param {object} config Router element configuration
   */
  __parseUnusedArguments(params, config) {
    if (config && config instanceof Object) {
      Object.keys(config).forEach(key => {
        if (params.indexOf(key) === -1) {
          console.warn(`RouterElement:WARN: "${key}" key is not used by ${this.child.name}.`)
        }
      })
    }
  }
}
