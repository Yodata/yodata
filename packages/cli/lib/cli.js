#!/usr/bin/env node

require('yargs')
	.env('YODATA')
	.commandDir('./command/')
	.option('output', { alias: 'o', describe: 'output', global: true })
	.completion()
	.demandCommand()
	.help()
	.argv
