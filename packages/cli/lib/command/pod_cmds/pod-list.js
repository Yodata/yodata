'use strict'
const config = require('@yodata/config')

exports.command = 'ls'
exports.description = 'list registered pods'
exports.handler = () => {
	console.log(config.listProfiles())
}
