'use strict'
const winston = require('winston')

const tty = new winston.transports.Console({
	format: winston.format.simple()
})

const logger = winston.createLogger({
	format: winston.format.simple(),
	transports: [
		tty
	]
})

module.exports = logger