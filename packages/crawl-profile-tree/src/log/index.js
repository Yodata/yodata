const winston = require('winston')
const debugLevel = 'info'
const {format} = winston
const {timestamp, printf} = format

const myformat = format.combine(
  format.metadata({key: 'meta'}),
  timestamp(),
  printf(({timestamp, level, message, meta}) => {
    let result = `${timestamp} ${level} ${message}`
    if (meta && Object.keys(meta).length > 0) {
      result += ` ${JSON.stringify(meta)}`
    }

    return result
  })
)

const infoLogName = 'info.log'
const errorLogName = 'error.log'

const logger = winston.createLogger({
  format: myformat,
  level: debugLevel,
  transports: [
    new winston.transports.Console({
      level: 'info',
    }),
    new winston.transports.File({
      level: 'debug',
      filename: 'debug.log',
    }),
    new winston.transports.File({
      level: 'error',
      filename: errorLogName,
    }),
    new winston.transports.File({
      level: 'info',
      filename: infoLogName,
    }),
  ],
})

module.exports = logger
