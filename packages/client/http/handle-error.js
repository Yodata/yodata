const logger = require('@yodata/logger')

module.exports = handleErrorResponse

function handleErrorResponse (response) {
  logger.error(response)
  const { statusCode, statusMessage, request } = response
  const result = { statusCode, statusMessage, url: request.url }
  return result
}
