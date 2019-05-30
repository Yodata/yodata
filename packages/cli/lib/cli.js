#!/usr/bin/env node
require('yargs')
	.scriptName('yodata')
	.wrap(80)
	.option('output', {
		alias: 'o',
		describe: 'format command output',
		global: true,
		default: 'yaml'
	})
	.commandDir('./command/', { recurse: false })
	.recommendCommands()
	.demandCommand()
	.completion()
	.argv
