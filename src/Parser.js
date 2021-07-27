import './__typesdef__'

import fs from 'fs'
import yaml from 'js-yaml'
import { join } from 'path'

import Root from './models/Root'

import FileNotFound from './errors/FileNotFound'
import EmptyConfigFile from './errors/EmptyConfigFile'

/** Router configuration parser for express router. */
export default class Parser {
  /**
   * Instanciate Parser
   *
   * @param {Express.Router} router Express router
   * @param {ParserConfig} [config] Parser configuration
   */
  constructor(router, config = {}) {
    if (!router) throw new TypeError('router argument is not defined')
    this.config = {
      config_dir: 'config',
      controller_dir: 'controller',
      middleware_dir: 'controller',
      http_default_response_code: 200,
      http_responses_code: [200, 201, 203],
    }
    if (config) {
      this.config = { ...this.config, ...config }
    }
  }

  /**
   * Load router configuration from a file
   *
   * @param {string} filename Configuration file path
   */
  loadFromFile(filename) {
    const filepath = join(this.config.config_dir, filename)
    if (!fs.existsSync(filepath) || fs.lstatSync(filepath).isDirectory()) {
      throw new FileNotFound(filepath)
    }
    this.loadFromString(fs.readFileSync(filepath))
  }

  /**
   * Load router configuration from a String
   *
   * @param {string} yml Router configuration string
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
   *
   * @param {{ string: RootObject }} config Configuration object
   * @returns {[Root]} Parsed configuration
   */
  parseConfig(config) {
    return Object.keys(config).map(name => {
      return new Root(name, config[name])
    })
  }
}
