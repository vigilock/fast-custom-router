import { lstatSync, existsSync } from 'fs'
import { resolve } from 'path'

/**
 * File not found error.
 *
 * Thrown when trying to read a nonexistent file.
 */
export default class FileNotFound extends Error {
  /**
   * Create a FileNotFound error.
   *
   * @param {string} filepath Path to unknown file
   * @throws {Error} Throwed if filepath parameter is not valid (null || undefined)
   */
  constructor(filepath) {
    super()
    if (!filepath) {
      throw Error('filepath parameter not passed to FileNotFound exception')
    }
    this.name = 'File not found'
    if (existsSync(filepath) && lstatSync(filepath).isDirectory()) {
      this.message = resolve(filepath) + ' is a directory.'
    } else {
      this.message = resolve(filepath) + ' not found.'
    }
  }
}
