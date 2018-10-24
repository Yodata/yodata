'use strict'

const program = require('commander')
const clc = require('cli-color')
const didYouMean = require('didyoumean')
const pkg = require('./package.json')
const logger = require('./lib/logger')

program.version(pkg.version)
program.option(
	'-N, --namespace <namespace>',
	'the namespace to use for this command'
)

const client = {}
client.cli = program
client.logger = require('./lib/logger')

client.errorOut = function (error, status) {
	require('./lib/error-out')(client, error, status)
}
client.getCommand = function (name) {
	for (let i = 0; i < client.cli.commands.length; i++) {
		if (client.cli.commands[i]._name === name) {
			return client.cli.commands[i]
		}
	}
	return null
}

require('./commands')(client)

const commandNames = program.commands.map(cmd => {
	return cmd._name
})

const RENAMED_COMMANDS = {
	'delete-site': 'hosting:disable',
	'disable:hosting': 'hosting:disable',
	'data:get': 'database:get',
	'data:push': 'database:push',
	'data:remove': 'database:remove',
	'data:set': 'database:set',
	'data:update': 'database:update',
	'deploy:hosting': 'deploy --only hosting',
	'deploy:database': 'deploy --only database',
	'prefs:token': 'login:ci'
}

program.action((cmd, cmd2) => {
	logger.error(clc.bold.red('Error:'), clc.bold(cmd), 'is not a yodata command')

	if (RENAMED_COMMANDS[cmd]) {
		logger.error()
		logger.error(
			clc.bold(cmd) + ' has been renamed, please run',
			clc.bold('firebase ' + RENAMED_COMMANDS[cmd]),
			'instead'
		)
	} else {
		let suggestion = didYouMean(cmd, commandNames)
		suggestion = suggestion || didYouMean([cmd, cmd2].join(':'), commandNames)
		if (suggestion) {
			logger.error()
			logger.error('Did you mean', clc.bold(suggestion) + '?')
		}
	}

	process.exit(1)
})

module.exports = client
