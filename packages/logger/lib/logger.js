'use strict'
// @ts-ignore
const { format, transports, createLogger } = require('winston')
const logSettings = {
	format: format.cli(),
	level: 'info',
	handleExceptions: true
}
const tty = new transports.Console(logSettings)

module.exports = createLogger({ transports: [tty] })
