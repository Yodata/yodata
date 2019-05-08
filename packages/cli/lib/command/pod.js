const client = require('@yodata/client')
const handler = require('../util/create-response-handler')

exports.command = 'pod <cmd>'
exports.scriptName = 'yodata pod'
exports.description = 'ls|add'
exports.builder = function (cli) {
	cli.default('output', 'yaml')
	cli.scriptName = 'pod'
	cli.command('get <target>', 'get target', {}, handler(get))
	return cli
}


function get({ target }) {
	return client.get(target)
}
