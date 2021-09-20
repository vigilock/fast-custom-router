/**
 * Validation data error.
 *
 * Thrown when data sent are invalid.
 */
 export default class ValidationDataError extends Error {
  /**
   * Create a ValidationDataError error.
   *
   * @param {string} code HTTP error code
   * @param {string} name Name of the error
   * @param {string} message Message of the error
   */
  constructor(code, name, message) {
    super(message)
    this.code = code
    this.name = name
  }
}