/**
 * @typedef Parameter Route parameter
 * @property {Function} type Cast function
 * @property {any} value Value that need to be valided
 * @property {boolean} [optionnal] True if the parameter is optionnal
 * @property {any} [defaultValue] Default value if the value is wrong
 */

/**
 * @typedef RouterConfiguration Route configuration
 * @property {string} path Route path
 * @property {Function} controller Route controller
 * @property {number} successStatusCode Default status code on success, 200 by default
 * @property {(req: Express.Request) => [Parameter]} getParams List of parameters to be valided
 */

/**
 * @typedef RootObject Router root configuration
 * @property {string} root Root of a set of routes
 * @property {[string]} [pre_middlewares] List of middleware names, called before routes
 * @property {[string]} [post_middlewares] List of middleware names, called after routes
 * @property {[RootObject | RouteObject]} routes Routes inside the root
 */

/**
 * @typedef RouteObject Express route
 * @property {string} path Route path with parameters (eg.: '/my-path/:param)
 * @property {[string]} [pre_middlewares] List of middleware names, called before routes
 * @property {[string]} [post_middlewares] List of middleware names, called after routes
 * @property {[{ string: RouteMethodObject }]} methods Defines methods that is
 */

/**
 * @typedef RouteMethodObject Route method
 * @property {string} controller Route controller name
 * @property {[string]} [pre_middlewares] List of middleware names, called before routes
 * @property {[string]} [post_middlewares] List of middleware names, called after routes
 * @property {number} [response_code] Response code that is returned on route call success, 200 by default
 * @property {object<string, string>} body Request body parameters that are required
 */

/**
 * @typedef RouteParameterObject Route parameter
 * @property {string} type Type of the value
 * @property {any} default_value Default value of the parameter, implicit optionnal declaration
 */

/** @typedef {'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'} RequestMethod HTTP request method that is allowed */

/**
 * @typedef ParserConfig Parser configuration
 * @property {string} controller_dir Absolute path that contains router controllers
 * @property {[number]} http_default_response_code Default http response code
 * @property {[number]} http_responses_code List of authorized http response codes
 */
