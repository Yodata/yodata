const chalk = require('chalk')
const logger = require('@yodata/logger')

module.exports = request => {
  // @ts-ignore
  // logger.debug(`${chalk.blue(request.method)} ${chalk.whiteBright(request.url.href)}\n`)
  return request
}
