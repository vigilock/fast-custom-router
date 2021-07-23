import './__typesdef__'

import fs from 'fs'
import yaml from 'js-yaml'

import Root from './models/Root'

import FileNotFound from './errors/FileNotFound'
import EmptyConfigFile from './errors/EmptyConfigFile'

/**
 * Router configuration parser for express router.
 */
export default class Parser {
  /**
   * Instanciate Parser
   * @param {Express.Router} router Express router
   */
  constructor(router) {
    if (!router) throw new TypeError('router argument is not defined')
  }

  /**
   * Load router configuration from a file
   * @param {String} filepath configuration file path
   */
  loadFromFile(filepath) {
    if (!fs.existsSync(filepath) || fs.lstatSync(filepath).isDirectory()) {
      throw new FileNotFound(filepath)
    }
    this.loadFromString(fs.readFileSync(filepath))
  }

  /**
   * Load router configuration from a String
   * @param {String} config router configuration string
   */
  loadFromString(yml) {
    if (!yml) {
      throw new EmptyConfigFile()
    }
    const config = yaml.load(yml)

    this.parseConfig(config)
  }

  /**
   * Parse a configuration object
   * @param {{String: RootObject}} config configuration object
   * @return {[Root]} parsed configuration
   * @throws {InvalidArgument} an argument is not valid
   * @throws {UnknownArgument} an argument is argument
   */
  parseConfig(config) {
    return Object.keys(config).map(name => {
      return new Root(name, config[name])
    })
  }
}
