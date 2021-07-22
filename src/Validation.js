import './__types__'

/**
 * Valid each parameters for the route on call.
 * @param {[Parameter]} params route parameters
 * @param {Function} next next function from express router
 */
export function validParams(params, next) {
  let paramsAreValid = true
  const validedParams = params.map(param => {
    const { type, value, optionnal, defaultValue } = param

    if ((value === undefined || value === null) && optionnal) return defaultValue

    if (typeof type === 'function') {
      try {
        return type(value)
      } catch (error) {
        paramsAreValid = false
        next(error)
      }
    } else if (type instanceof RegExp) {
      if (!type.test(value)) {
        paramsAreValid = false
        next({
          code: 400,
          detail: `'${value}' doesn't match ${type} regex.`,
        })
      }
    } else {
      paramsAreValid = false
      next({
        code: 500,
        detail: `'${value}' validation failed.`,
      })
    }
    return value
  })

  return {
    validedParams,
    paramsAreValid,
  }
}

/**
 * Enumeration of type validation functions.
 */
export default {
  NUMBER: Number,
  STRING: String,
  BOOLEAN: Boolean,
  MAIL: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
}
