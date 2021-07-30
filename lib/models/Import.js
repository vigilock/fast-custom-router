import '../__typesdef__.js'

import { readFileSync } from 'fs'
import { join } from 'path'
import yaml from 'js-yaml'

import RouterElement from './RouterElement.js'
import Parser from '../Parser.js'

/** Load configuration file when import is explicited. */
export default class Import extends RouterElement {
  /**
   * Instanciate imports.
   *
   * @param {[string]} files List of configuration files
   * @param {ParserConfig} parserConfig Parser configuration
   */
  constructor(files, parserConfig) {
    super(Import, [], {})

    this.routes = []

    this.__parseFiles(files, parserConfig)
  }

  /**
   * Load configuration files.
   *
   * @param {[string]} files File paths
   * @param {ParserConfig} parserConfig Parser configuration
   */
  __parseFiles(files, parserConfig) {
    files.forEach(file => {
      const configpath = join(parserConfig.config_dir, file)
      const file_content = readFileSync(configpath)
      const config = yaml.load(file_content)
      this.routes = this.routes.concat(Parser.__parseRouteElements(config, parserConfig))
    })
  }

  /**
   * Load sub root and routes from name and parser configuration.
   *
   * @param {Router} router Express router
   * @param {string} path Middleware path
   * @param {ParserConfig} config Parser configuration
   */
  async load(router, path, config) {
    for (const route of this.routes) {
      await route.load(router, path, config)
    }
  }

  toString() {
    let res = ''
    for (const obj of this.routes) {
      res += obj.toString() + '\n'
    }
    return res.slice(0, -1)
  }
}
