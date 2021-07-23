/**
 * Controller not found error.
 *
 * Thrown when trying to load a nonexistent module.
 */
export default class ControllerNotFound extends Error {
  /**
   * Create a ControllerNotFound error.
   * @param {String} filepath path to unknown module
   */
  constructor(filepath) {
    super()
    this.name = 'Controller not found'
    this.message = `"${filepath}" is not a valid module path.`
  }
}
