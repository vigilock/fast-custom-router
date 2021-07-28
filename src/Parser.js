import './__typesdef__'

import fs from 'fs'
import yaml from 'js-yaml'
import { join } from 'path'
import Express from 'express'

import Import from './models/Import'
import Root from './models/Root'
import Route from './models/Route'

import FileNotFound from './errors/FileNotFound'
import EmptyConfigFile from './errors/EmptyConfigFile'
import InvalidRouteElement from './errors/InvalidRouteElement'

/** Router configuration parser for express router. */
export default class Parser {
  /**
   * Instanciate Parser
   *
   * @param {Express.Router} router Express router
   * @param {ParserConfig} [config] Parser configuration
   */
  constructor(router, config = {}) {
    if (!router) {
      throw new TypeError('router argument is not defined')
    }
    this.router = router
    this.config = {
      config_dir: 'config',
      controller_dir: 'controller',
      middleware_dir: 'controller',
      http_default_response_code: 200,
      http_responses_code: [200, 201, 203],
    }
    /** @type {[Root | Route]} */
    this.parsedObjects = []
    if (config) {
      this.config = { ...this.config, ...config }
    }
  }

  /**
   * Load router configuration from a file
   *
   * @param {string} filename Configuration file path
   */
  parseFromFile(filename) {
    const filepath = join(this.config.config_dir, filename)
    if (!fs.existsSync(filepath) || fs.lstatSync(filepath).isDirectory()) {
      throw new FileNotFound(filepath)
    }
    this.parseFromString(fs.readFileSync(filepath))
  }

  /**
   * Load router configuration from a String
   *
   * @param {string} yml Router configuration string
   */
  parseFromString(yml) {
    if (!yml) {
      throw new EmptyConfigFile()
    }
    const config = yaml.load(yml)

    this.parseConfig(config)
  }

  static __parseRouteElements(config, parserConfig) {
    const res = []
    Object.keys(config).forEach(key => {
      const el = config[key]
      if (key === 'import') {
        res.push(new Import(el, parserConfig))
      } else {
        if (el.root) {
          res.push(new Root(key, el, parserConfig))
        } else if (el.path) {
          res.push(new Route(key, el))
        } else {
          throw new InvalidRouteElement(`${key} is no recongnized as a Root or as a Route.`)
        }
      }
    })
    return res
  }

  /**
   * Parse a configuration object
   *
   * @param {{ string: RootObject }} config Configuration object
   */
  parseConfig(config) {
    this.parsedObjects = Parser.__parseRouteElements(config, this.config)
  }

  /** Load parsed objects and hydrate express router. */
  load() {
    this.parsedObjects.forEach(obj => {
      obj.load(this.router, '', this.config)
    })
  }
}
