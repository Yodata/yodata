const winston = require('winston')
const { format } = winston
const { timestamp, printf, metadata } = format
const DEBUG_LEVEL = 'info'

const myformat = format.combine(
  metadata({ key: 'data' }),
  timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  printf(info => `${info.timestamp} [${info.level}] ${info.message} ${JSON.stringify(info.data)}`)
)
const debugLog = new winston.transports.Console({ level: 'debug' })
const infoLog = new winston.transports.Console({ level: 'info' })
const errorLog = new winston.transports.Console({ level: 'error' })

const logger = winston.createLogger({
  format: myformat,
  level: DEBUG_LEVEL,
  transports: [
    errorLog,
    infoLog,
    debugLog
  ]
})

module.exports = logger
