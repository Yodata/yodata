'use strict'
const {format, transports, createLogger} = require('winston')

const logSettings = {
	format: format.cli(),
	level: 'info',
	handleExceptions: true
}
const tty = new transports.Console(logSettings)

const logger = createLogger({transports: [tty]})

module.exports = logger
