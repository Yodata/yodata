const client = require('@yodata/client')
const handler = require('../util/create-response-handler')


exports.command = 'subscription <cmd>'
exports.description = 'ls|add'
exports.builder = function (cli) {
	cli.default('output', 'text')
	cli.command('ls', 'list', {}, handler(client.subscription.list))
	cli.command(
		'add <agent>',
		'add subscription',
		{
			agent: {
				description: 'subscriber uri'
			},
			topic: {
				alias: 't',
				description: 'subscription topic',
				default: 'realestate/contact'
			},
			target: {
				description: 'subscription target (URL|ARN)'
			}
		},
		handler(client.subscription.add)
	)
	return cli
}
