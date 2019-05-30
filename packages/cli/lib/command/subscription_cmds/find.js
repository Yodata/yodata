const { subscription } = require('@yodata/client')
const print = require('../../util/print')

exports.command = 'find <term>'
exports.description = 'find something'
exports.builder = {
	output: {
		default: 'table'
	}
}
exports.handler = print.command(subscription.find, 'term')
