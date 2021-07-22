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
