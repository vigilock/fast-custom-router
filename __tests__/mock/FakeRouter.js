/** Mock express router. */
export default class FakeRouter {
  constructor() {
    this.init()
  }
  init() {
    this.routes = {
      use: {},
      get: {},
      post: {},
      put: {},
      delete: {},
    }
    this.orderedCall = []
  }
  use(path, middleware) {
    this.routes.use[path] = middleware
    this.orderedCall.push({
      path,
      middleware,
    })
  }
  get(path, route) {
    this.routes.get[path] = route
    this.orderedCall.push({
      path,
      route,
    })
  }
  post(path, route) {
    this.routes.post[path] = route
    this.orderedCall.push({
      path,
      route,
    })
  }
  put(path, route) {
    this.routes.put[path] = route
    this.orderedCall.push({
      path,
      route,
    })
  }
  delete(path, route) {
    this.routes.delete[path] = route
    this.orderedCall.push({
      path,
      route,
    })
  }
}
