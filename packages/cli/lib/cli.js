#!/usr/bin/env node
require('yargs')
	.wrap(160)
	.option('output', {
		alias: 'o',
		describe: 'format command output',
		global: true,
		default: 'yaml'
	})
	.commandDir('./command/')
	.recommendCommands()
	.demandCommand()
	.completion()
	.argv
