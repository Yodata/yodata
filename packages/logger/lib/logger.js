'use strict'
const logger = require('loglevel')
const { inspect } = require('util')
const originalFactory = logger.methodFactory
logger.setLevel(getDefaultLogLevel())
logger.methodFactory = function (methodName, logLevel, loggerName) {
	var rawMethod = originalFactory(methodName, logLevel, loggerName);
	return function (message, data, options = {}) {
		const depth = Number(process.env['LOG_DEPTH'] || '5')
		const messages = []
		if (typeof message === 'object') {
			data = message
			message = data.message
		}
		messages.push(message)

		if (typeof data === 'object') {
			let formattedData = inspect(data, { compact: false, depth: depth, ...options })
			messages.push('\n' + formattedData)
		}

		rawMethod.apply(undefined, messages);
	};
};
logger.setLevel(logger.getLevel()); // Be sure to call setLevel method


exports.createLogger = logger.getLogger
exports.debug = logger.debug
exports.error = logger.error
exports.info = logger.info
exports.log = logger.debug
exports.table = console.table
exports.trace = logger.trace
exports.warn = logger.warn
exports.getLevel = logger.getLevel
exports.setLevel = logger.setLevel
exports.setDefaultLevel = logger.setDefaultLevel
exports.levels = logger.levels
exports.methodFactory = logger.methodFactory



function getDefaultLogLevel() {
	const { LOG_LEVEL, NODE_ENV = 'development', LOG_DEPTH = '5' } = process.env
	return LOG_LEVEL || NODE_ENV == 'production' ? 'info' : 'debug'
}
