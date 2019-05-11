#!/usr/bin/env node
const { terminalWidth } = require('yargs')

require('yargs')
	.env('YODATA')
	.scriptName('yodata')
	.commandDir('./command/')
	.option('output', { alias: 'o', describe: 'output', global: true })
	.demandCommand()
	.help()
	.wrap(Math.min(102, terminalWidth()))
	.argv
