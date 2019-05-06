const client = require('@yodata/client')
const handler = require('../util/create-response-handler')


exports.command = 'subscription <cmd>'
exports.description = 'ls|add'
exports.builder = function (cli) {
	cli.default('output', 'text')
	cli.command('ls', 'list', {}, handler(client.subscription.list))
	cli.command(
		'add <agent> [topic]',
		'adds a subscription for agent',
		{
			agent: {
				description: 'subscriber uri',
				demandOption: true,
				type: 'string'
			},
			topic: {
				description: 'object shortcut: topic => /event/topic/{topic}',
				type: 'string'
			},
			context: {
				alias: 'c',
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
