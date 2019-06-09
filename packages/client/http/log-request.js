const chalk = require('chalk')
const logger = require('@yodata/logger')

module.exports = request => {
  // @ts-ignore
  logger.info(`${chalk.blue(request.method)} ${chalk.green(request.href)}\n`)
  return request
}
