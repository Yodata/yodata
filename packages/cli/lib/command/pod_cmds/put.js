'use strict'
const client = require('../../client')
const print = require('../../util/print')

exports.command = 'put <target> <filepath>'
exports.description = 'get a resource from your pod'
exports.builder = {
	positional: {
		target: {
			type: 'string',
			desc: 'url/path to the target resource'
		}
	},
	data: {
		desc: 'parse body if possible',
		type: 'boolean',
		default: true
	}
}
exports.handler = print.command(client.get, 'target')
