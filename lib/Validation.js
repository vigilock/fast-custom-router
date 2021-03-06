import './__typesdef__.js'

/**
 * Valid each parameters for the route on call.
 *
 * @param {[Parameter]} params Route parameters
 * @param {Function} next Next function from express router
 * @returns {{ validedParams: [any]; paramsAreValid: Boolean }} ValidedParams is filtered data, and paramsAreValid indicates if all parameters are valid
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

/** Enumeration of type validation functions. */
export default {
  NUMBER: value => {
    if (isNaN(value)) {
      throw {
        code: 400,
        message: `${value} is not a number`,
      }
    }
    return Number(value)
  },
  STRING: String,
  BOOLEAN: value => {
    if (typeof value === 'string') {
      if (value === 'true' || value === '1') return true
      else if (value === 'false' || value === '0') return false
    }
    return Boolean(value)
  },
  OBJECT: Object,
  /* eslint no-useless-escape: "off" */
  MAIL: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
}
