#!/usr/bin/env node
const info = require('.')
const handler = require('@yodata/cli').createCLIResponseHandler

require('yargs')
	.env('YODATA')
	.option('output', { alias: 'o', describe: 'output', global: true })
	.command('info', 'returns info', {}, handler(info))
	.demandCommand()
	.help()
	.argv
