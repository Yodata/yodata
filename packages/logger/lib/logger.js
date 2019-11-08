
const { format, transports, createLogger } = require('winston')
const { timestamp, printf, metadata } = format

const aws = format.combine(
  metadata({ key: 'data' }),
  timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  printf(info => `${info.timestamp} [${info.level}] ${info.message} ${JSON.stringify(info.data)}`)
)

const defaultLogger = createLogger({
  format: aws,
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
