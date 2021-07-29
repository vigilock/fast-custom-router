/**
 * Module not found error.
 *
 * Thrown when trying to load a nonexistent module.
 */
export default class ModuleNotFound extends Error {
  /**
   * Create a ModuleNotFound error.
   *
   * @param {string} filepath Path to unknown module
   */
  constructor(filepath) {
    super()
    this.name = 'Module not found'
    this.message = `"${filepath}" is not a valid module path, or does not provide (default) export.`
  }
}
