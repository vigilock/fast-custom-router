/**
 * @typedef Parameter Route parameter
 * @property {Function} type Cast function
 * @property {any} value Value that need to be valided
 * @property {Boolean} [optionnal] True if the parameter is optionnal
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
 * @property {String} root Root of a set of routes
 * @property {[String]} [pre_middlewares] List of middleware names, called before routes
 * @property {[String]} [post_middlewares] List of middleware names, called after routes
 * @property {[RootObject | RouteObject]} routes Routes inside the root
 */

/**
 * @typedef RouteObject Express route
 * @property {String} path Route path with parameters (eg.: '/my-path/:param)
 * @property {[String]} [pre_middlewares] List of middleware names, called before routes
 * @property {[String]} [post_middlewares] List of middleware names, called after routes
 * @property {[{ String: RouteMethodObject }]} methods Defines methods that is
 */

/**
 * @typedef RouteMethodObject Route method
 * @property {String} controller Route controller name
 * @property {[String]} [pre_middlewares] List of middleware names, called before routes
 * @property {[String]} [post_middlewares] List of middleware names, called after routes
 * @property {Number} [response_code] Response code that is returned on route call success, 200 by default
 * @property {Object<String, String>} body Request body parameters that are required
 */

/**
 * @typedef RouteParameterObject Route parameter
 * @property {String} type Type of the value
 * @property {any} default_value Default value of the parameter, implicit optionnal declaration
 */

/** @typedef {'GET' | 'POST' | 'PUT' | 'DELETE'} RequestMethod HTTP request method that is allowed */

/**
 * @typedef ParserConfig Parser configuration
 * @property {String} controller_dir Absolute path that contains router controllers
 * @property {[Number]} http_default_response_code Default http response code
 * @property {[Number]} http_responses_code List of authorized http response codes
 */
