#!/usr/bin/env node
const deploy = require('.')

require('yargs')
	.scriptName("deploy")
	.options({
		f: {
			alias: 'filepath',
			description: 'the file to be deployed',
			normalize: true
		},
		e: {
			alias: 'environment',
			description: 'production | development',

		}
	})
	.default('environment', 'dev')
	.command('$0 [environment]', 'deploy to <environment>', {}, deploy)
	.help()
	.argv
