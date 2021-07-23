/**
 * Check if child element has unused arguments.
 */
export default class RouterElement {
  /**
   * Check if child element has unused arguments.
   * @param {RouterElement} child child of this class
   * @param {*} params used params
   * @param {*} config child configuration
   */
  constructor(child, params = [], config = {}) {
    if (config && config instanceof Object) {
      Object.keys(config).forEach(key => {
        if (params.indexOf(key) === -1) {
          console.warn(`RouterElement:WARN: "${key}" key is not used by ${child.name}.`)
        }
      })
    }
  }
}
