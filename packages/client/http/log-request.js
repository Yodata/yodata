const logger = require('@yodata/logger')

module.exports = request => {
  // @ts-ignore
  logger.debug(`${request.method} ${request.url.href}\n`)
  // return request
}
