const client = require('@yodata/client')
const print = require('../util/print')

exports.command = 'whoami'
exports.description = 'prints information about the current user and pod'
exports.builder = {
	output: { default: 'text' }
}
exports.handler = print.command(client.whoami)
