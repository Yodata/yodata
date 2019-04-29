#!/usr/bin/env node

require('yargs')
	.env('YODATA')
	.option('output', {alias: 'o', describe: 'output', global: true})
	.commandDir('./command/')
	.demandCommand()
	.help()
	.argv