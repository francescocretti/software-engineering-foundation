// HTTP status codes are shared by every feature and by the error contract, so
// they are owned by the transport layer rather than by one feature.
export const HTTP_OK = 200
export const HTTP_CREATED = 201
export const HTTP_BAD_REQUEST = 400
export const HTTP_NOT_FOUND = 404
export const HTTP_INTERNAL_SERVER_ERROR = 500
