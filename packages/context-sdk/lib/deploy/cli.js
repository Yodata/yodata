#!/usr/bin/env node
const deploy = require('.')

require('yargs')
	.scriptName("deploy")
	.options({
		f: {
			alias: 'filepath',
			description: 'path to your context.yaml'
		},
		e: {
			alias: 'environment',
			description: 'stage | production',
			default: 'stage'
		}
	})
	.command('$0', 'deploy context', {}, deploy)
	.help()
	.argv
