'use strict'

const { inbox } = require('@yodata/client')
const { print } = require('../../util')

exports.command = 'ls'
exports.description = 'list inbox items'
exports.builder = {
	output: {
		default: 'table'
	}
}
exports.handler = props => {
	inbox.list(props)
		.then(items => {
			return items.map(message => ({
				index: message.index,
				time: message.timestamp ? new Date(message.timestamp).toISOString() : '',
				topic: message.topic,
				id: message.id ? message.id.split('/inbox/')[1] : ''
			}))
		})
		.then(print.result(props))
}
