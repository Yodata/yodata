const winston = require('winston')
const debugLevel = 'info'
const { format } = winston
const { timestamp, printf } = format

const myformat = format.combine(
  format.metadata({ key: 'meta' }),
  timestamp(),
  printf(({ timestamp, level, message, meta }) => {
    let result = `${timestamp} ${level} ${message}`
    if (meta && Object.keys(meta).length > 0) {
      result += ` ${JSON.stringify(meta)}`
    }

    return result
  })
)

const logger = winston.createLogger({
  format: myformat,
  level: debugLevel,
  transports: [
    new winston.transports.Console()
  ]
})

module.exports = logger
