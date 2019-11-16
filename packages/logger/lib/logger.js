
const { format, transports, createLogger } = require('winston')
const { timestamp, printf, metadata, errors, json } = format

const defaultLogger = createLogger({
  format: format.combine(
    errors({ stack: true }),
    json()
  ),
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    new transports.Console({ handleExceptions: true })
  ]
})

defaultLogger.createLogger = createLogger
defaultLogger.table = console.table
defaultLogger.tap = (message, level) => data => {
  const log = defaultLogger[ level ] || defaultLogger
  log(message, data)
}
defaultLogger.trace = defaultLogger.debug

module.exports = defaultLogger
