#!/usr/bin/env node

require('yargs')
	.env('YODATA')
	.scriptName('yodata')
	.commandDir('./command/')
	.option('output', { alias: 'o', describe: 'output', global: true })
	.demandCommand()
	.help()
	.argv
