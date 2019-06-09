'use strict'
const client = require('../../client')
const print = require('../../util/print')

exports.command = 'get <target>'
exports.description = 'get a resource from your pod'
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
exports.handler = () => {
	console.log({ client })
}
