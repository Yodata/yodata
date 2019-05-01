#!/usr/bin/env node
const deploy = require('.')

require('yargs')
	.scriptName("deploy")
	.options({
		f: {
			alias: 'filepath',
			description: 'the file to be deployed'
		},
		e: {
			alias: 'environment',
			description: 'production | development',
			default: 'stage'
		}
	})
	.command('$0', 'deploy context', {}, deploy)
	.help()
	.argv
