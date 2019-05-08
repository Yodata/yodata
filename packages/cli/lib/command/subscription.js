const client = require('@yodata/client')
const handler = require('../util/create-response-handler')


exports.command = 'subscription <cmd>'
exports.description = 'ls|add'
exports.builder = function (cli) {
	cli.default('output', 'yaml')

	cli.command(
		'ls',
		'list',
		{},
		handler(client.subscription.list)
	)

	cli.command(
		'add',
		'add/update subscription',
		{
			agent: {
				description: 'subscriber uri',
				type: 'string'
			},
			t: {
				alias: 'topic',
				description: 'object shortcut: topic => /event/topic/{topic}',
				type: 'string'
			},
			c: {
				alias: 'context',
				description: '(url) messages will be processed by context before delivery',
				type: 'string'
			},
			target: {
				description: 'push events to [target] URL|ARN',
				type: 'string'
			},
			object: {
				description: 'subscription path',
				type: 'string'
			}
		},
		handler(client.subscription.add)
	)
	return cli
}
