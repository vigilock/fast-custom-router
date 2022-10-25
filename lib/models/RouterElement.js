import { join } from 'path'

import InvalidArgument from '../errors/InvalidArgument.js'
import ModuleNotFound from '../errors/ModuleNotFound.js'

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
   * @param {string[]} params List of configuration option name
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

  /**
   * Load controller from name and parser configuration.
   *
   * @param {string} name Module name
   * @param {string} directory Module directory
   * @returns {Promise<Function>} Module
   */
  async __loadModule(name, directory) {
    const [file_path, module_name] = name.split(':')
    const module_path = join(directory, file_path + '.js')
    try {
      const module = await import(module_path)
      if (module_name) {
        if (!module[module_name]) {
          throw new ModuleNotFound(module_path + ':' + module_name)
        }
        return module[module_name]
      } else if (module.default) {
        return module.default
      }
      throw null
    } catch (error) {
      if (!error) {
        throw new ModuleNotFound(name)
      }
      throw error
    }
  }
}
