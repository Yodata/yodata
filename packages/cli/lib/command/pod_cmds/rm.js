'use strict'
const client = require('../../client')
const print = require('../../util/print')

exports.command = 'rm <target>'
exports.description = 'delete target resource'
exports.builder = {
	target: {
		type: 'string',
		desc: 'url/path to the target resource'
	},
	data: {
		desc: 'parse body if possible',
		type: 'boolean',
		default: true
	}
}
exports.handler = print.command(client.delete)
