'use strict'
const logger = require('loglevel')
const { inspect } = require('util')

const originalFactory = logger.methodFactory

logger.methodFactory = function (methodName, logLevel, loggerName) {
  const rawMethod = originalFactory(methodName, logLevel, loggerName)
  return function (message, data, options = {}) {
    const messages = []
    if (typeof message === 'object') {
      data = message
      message = data.message || levelName()
    }
    messages.push(message)

    const compact = options[ 'compact' ] || true
    const depth = Number(options[ 'depth' ] || process.env.LOG_DEPTH || '5')
    if (typeof data === 'object') {
      messages.push(inspect(data, { ...options, compact, depth }))
    }

    rawMethod.apply(undefined, messages)
  }
}

const logValue = (message, level = getDefaultLogLevel()) => data => {
  logger[ level ](message, data)
  return data
}

const levelName = () => {
  return Object.keys(logger.levels)[ logger.getLevel() ]
}

function getDefaultLogLevel () {
  let level = process.env.LOG_LEVEL || process.env.NODE_ENV === 'production' ? 'error' : 'info'
  return logger.levels[ String(level).toUpperCase() ] || 4
}

function pretty (message, data, options = {}) {
  const level = levelName()
  const depth = 10
  const compact = false
  logger[ level ](message, data, { ...options, compact, depth })
}

logger.setLevel(getDefaultLogLevel())

exports.createLogger = logger.getLogger
exports.debug = logger.debug
exports.error = logger.error
exports.info = logger.info
exports.log = logger.info
exports.table = console.table
exports.trace = logger.trace
exports.warn = logger.warn
exports.getLevel = logger.getLevel
exports.setLevel = logger.setLevel
exports.setDefaultLevel = logger.setDefaultLevel
exports.levels = logger.levels
exports.methodFactory = logger.methodFactory
exports.levelName = levelName
exports.pretty = pretty
exports.echo = function () {
  logger.error(...arguments)
  return arguments
}
exports.tap = logValue
exports.value = logValue
