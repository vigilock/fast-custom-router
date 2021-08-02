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
   * @param {[RouteParameter]} extraQuery Root query parameters
   */
  constructor(files, parserConfig, extraQuery = []) {
    super(Import, [], {})

    this.routes = []
    this.query = extraQuery

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
      this.routes = this.routes.concat(Parser.__parseRouteElements(config, parserConfig, this.query))
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

  /**
   * Make readable this object
   *
   * @returns {string} Instance description
   */
  toString() {
    let res = []
    const lastElement = this.routes[this.routes.length - 1]
    for (const obj of this.routes) {
      let objDesc = obj.toString()
      let firstChar = ''
      if (obj === lastElement) {
        firstChar = '└'
      } else {
        let first = true
        firstChar = '├'
        objDesc = objDesc
          .split('\n')
          .map(l => {
            if (first) {
              first = false
              return l
            } else {
              return '│' + l
            }
          })
          .join('\n')
      }
      res.push(firstChar + '── ' + objDesc)
    }
    return res.join('\n')
  }
}
