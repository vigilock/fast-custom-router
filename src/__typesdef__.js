/**
 * @typedef Parameter Route parameter
 * @property {Function} type Cast function
 * @property {any} value Value that need to be valided
 * @property {Boolean} [optionnal] true if the parameter is optionnal
 * @property {any} [defaultValue] Default value if the value is wrong
 */

/**
 * @typedef RouterConfiguration Route configuration
 * @property {String} path Route path
 * @property {Function} controller Route controller
 * @property {Number} successStatusCode Default status code on success, 200 by default
 * @property {(req: Express.Request) => [Parameter]} getParams List of parameters to be valided
 */

/**
 * @typedef RootObject Router root configuration
 * @property {String} root root of a set of routes
 * @property {[String]} [pre_middlewares] list of middleware names, called before routes
 * @property {[String]} [post_middlewares] list of middleware names, called after routes
 * @property {[RootObject|RouteObject]} routes routes inside the root
 */

/**
 * @typedef RouteObject Express route
 * @property {String} path route path with parameters (eg.: '/my-path/:param)
 * @property {[{String: RouteMethodObject}]} methods defines methods that is
 */

/**
 * @typedef RouteMethodObject Route method
 * @property {String} controller route controller name
 * @property {[String]} [pre_middlewares] list of middleware names, called before routes
 * @property {[String]} [post_middlewares] list of middleware names, called after routes
 * @property {Number} [response_code] response code that is returned on route call success, 200 by default
 * @property {Object.<String, String>} body request body parameters that are required
 */

/**
 * @typedef RouteParameterObject Route parameter
 * @property {String} type type of the value
 * @property {any} defaultValue default value of the parameter, implicit optionnal declaration
 */
