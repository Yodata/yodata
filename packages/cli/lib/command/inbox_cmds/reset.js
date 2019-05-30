const assert = require('assert-plus')
const { profile } = require('@yodata/config')
const { inbox } = require('@yodata/client')

exports.command = 'reset'
exports.description = 'Reset your inbox cache'
exports.builder = {
	last: {
		type: 'boolean',
		default: false,
		group: 'reset',
		desc: 'Removes inbox cache for the current page (forcing your next inbox ls to reload from the source)'
	}
}
exports.handler = function (argv) {
	const { last } = argv
	if (last === true) {
		const lastv = profile.get('inbox.last')
		if (typeof lastv === 'string' && lastv.length > 0) {
			profile.delete(`cache.${lastv}`)
		}
	}
}
