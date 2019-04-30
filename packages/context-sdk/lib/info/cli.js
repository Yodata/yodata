#!/usr/bin/env node
const info = require('.')
const handler = require('@yodata/cli').createCLIResponseHandler

require('yargs')
	.scriptName('npx info')
	.env('YODATA')
	.option('output', { alias: 'o', describe: 'output', global: true })
	.command('$0', 'return package info', {}, handler(info))
	.help()
	.argv
