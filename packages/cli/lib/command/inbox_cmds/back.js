'use strict'

const { inbox } = require('@yodata/client')
const { print } = require('../../util')

exports.command = 'back <count>'
exports.description = 'go back count pages in inbox history'
exports.builder = {
	output: {
		default: 'table'
	}
}
exports.handler = props => {
	inbox.back(props)
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
