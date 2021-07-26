/** Regular expression that valid url paths. */
export const PATH_REGEX = /^[a-zA-Z0-9\-_/:]{3,}$/

/** List of accepted http request methods. */
export const ACCEPTED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

/** List of accept HTTP response code on controller call successful. */
export const HTTP_RESPONSE_CODE = [200, 201, 202, 203, 204, 205, 206]

/** Default HTTP response code */
export const HTTP_DEFAULT_RESPONSE_CODE = 200
