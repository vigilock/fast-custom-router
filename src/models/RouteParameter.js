import RouterElement from './RouterElement'

export default class RouteParameter extends RouterElement {
  constructor(name, config) {
    super(RouteParameter, ['type', 'default_value'], config)
  }
}
