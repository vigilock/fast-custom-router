export default class FakeRouter {
  constructor() {
    this.init()
  }
  init() {
    this.routes = {
      get: {},
      post: {},
      put: {},
      delete: {},
    }
    this.orderedCall = []
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
