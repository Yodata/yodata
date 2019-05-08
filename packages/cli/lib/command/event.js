'use script'

const client = require('@yodata/client')
const handler = require('../util/create-response-handler')

exports.command = 'event <cmd>'
exports.description = 'ls|publish'
exports.builder = function (cli) {
	cli.command('ls <topic>', 'list events', {}, handler(client.event.list))
	cli.command('hooks', 'get hooks', {}, handler(client.event.getHooks))
	cli.command('publish', 'publish to event recipient/topic', {
		r: {
			alias: 'recipient',
			description: 'event user/source'
		},
		t: {
			alias: 'topic',
			description: 'topic'
		},
		d: {
			alias: 'data',
			description: 'data (payload)'
		},
		f: {
			alias: 'filepath',
			description: 'path to message'
		}
	}, handler(client.event.publish))
	return cli
}

