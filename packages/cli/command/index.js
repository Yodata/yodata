const commander = require('commander')

module.exports = function (client) {
	const loadCommand = function (name) {
		const cmd = require('./' + name)
		const program = client.cli
		program.command(name).action(cmd.action)
	}

	client.createApiKey = loadCommand('hello')
}
