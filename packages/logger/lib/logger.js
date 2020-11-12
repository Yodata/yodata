const inspect = require('util').inspect
const kindOf = require('kind-of')

const levels = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  http: 4,
  verbose: 4,
  debug: 5,
  silly: 6
}

function formatInput (fn) {
  return function main (...value) {
    let result = [...value]
    result = result.map(v => {
      switch (kindOf(v)) {
        case 'string':
          return v
        case 'object':
          return v.message ? `${v.message} ${JSON.stringify(v)}` : JSON.stringify(v)
        default:
          return inspect(v, false, 2, true)
      }
    })
    const response = result.join(' ')
    fn(response)
    return response
  }
}

const getLevel = label => levels[String(label).toLowerCase()] || levels[String(process.env.LOG_LEVEL).toLowerCase()] || 0
const checkLevel = label => (getLevel(label) <= getLevel())
const createLogger = (fn, level) => function () {
  const handler = formatInput(fn)
  if (checkLevel(level)) {
    handler(...arguments)
  }
}

exports.getLevel = getLevel
exports.checkLevel = checkLevel
exports.json = jsonLogger
exports.log = jsonLogger
exports.info = createLogger(console.info, 'info')
exports.debug = createLogger(console.debug, 'debug')
exports.warn = createLogger(console.warn, 'warn')
exports.error = createLogger(console.error, 'error')
exports.clear = console.clear
exports.logResponse = (logger, object) => result => {
  logger({ object, result })
  return result
}

exports.createLogger = createLogger
exports.table = createLogger(console.table)
exports.tap = (message, level) => data => {
  const log = console[level] || console[getLevel()]
  log(message, data)
}
exports.trace = createLogger(console.trace)

function jsonLogger ({ level = 'info', message, ...data }) {
  switch (String(level)) {
    case 'info':
      return formatInput(console.info)(message, data)
    case 'debug':
      return formatInput(console.debug)(message, data)
    case 'warn':
      return formatInput(console.warn)(message, data)
    case 'error':
      return formatInput(console.error)(message, data)
    default:
      return formatInput(console.log)(message, data)
  }
}
