import InvalidArgument from '../errors/InvalidArgument'
import Middleware from './Middleware'
import RouterElement from './RouterElement'

/** Check if child element has unused arguments. */
export default class RouterElementMiddleware extends RouterElement {
  /**
   * Check if child element has unused arguments and middlewares.
   *
   * @param {RouterElement} child Child of this class
   * @param {any} params Used params
   * @param {any} config Child configuration
   */
  constructor(child, params = [], config) {
    super(child, [...params, 'pre_middlewares', 'post_middlewares'], config)

    this.pre_middlewares = []
    this.post_middlewares = []

    this.pre_middlewares = this.__parseMiddlewares(config.pre_middlewares)
    this.post_middlewares = this.__parseMiddlewares(config.post_middlewares)
  }

  /**
   * Check if middlewares are valid.
   *
   * @param {[string]} middlewares Middleware list
   * @returns {[Middleware]} List of middleware objects
   */
  __parseMiddlewares(middlewares) {
    if (middlewares) {
      if (!(middlewares instanceof Array)) {
        throw new InvalidArgument(`${this.child.name}.middlewares=${middlewares} is not a dictionnary.`)
      }
      return middlewares.map(middleware => {
        return new Middleware(middleware)
      })
    }
    return []
  }
}
