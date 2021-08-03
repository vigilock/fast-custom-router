import { CUSTOM_ARG_NAME } from './__constants__.js'
import './__typesdef__.js'

import fs from 'fs'
import yaml from 'js-yaml'
import { join } from 'path'

import Import from './models/Import.js'
import Root from './models/Root.js'
import Route from './models/Route.js'

import FileNotFound from './errors/FileNotFound.js'
import EmptyConfigFile from './errors/EmptyConfigFile.js'
import InvalidRouteElement from './errors/InvalidRouteElement.js'

/** Router configuration parser for express router. */
export default class Parser {
  /**
   * Instanciate Parser
   *
   * @param {Router} router Express router
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
      middleware_dir: 'middleware',
      http_default_response_code: 200,
      http_responses_code: [200, 201, 202, 203, 204, 205, 206],
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

  static __parseRouteElements(config, parserConfig, extraParams = []) {
    const res = []
    Object.keys(config).forEach(key => {
      const el = config[key]
      if (key === 'import') {
        res.push(new Import(el, parserConfig, Parser.__parseRouteElements, extraParams))
      } else {
        if (el?.root) {
          res.push(new Root(key, el, parserConfig, Parser.__parseRouteElements, extraParams))
        } else if (el?.path) {
          res.push(new Route(key, el, extraParams))
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
  async load() {
    this.router.use((req, res, next) => {
      req[CUSTOM_ARG_NAME] = {}
      next()
    })
    for (const obj of this.parsedObjects) {
      await obj.load(this.router, '/', this.config)
    }
  }

  toString() {
    let res = ''
    for (const obj of this.parsedObjects) {
      res += obj.toString() + '\n'
    }
    return res.slice(0, -1)
  }
}
