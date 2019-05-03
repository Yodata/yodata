#!/usr/bin/env node
'use strict'
const getContextInfo = require('../info')
const transform = require('../transform')
const { createCLIResponseHandler } = require('@yodata/cli')
const command = createCLIResponseHandler(transform)

require('yargs')
	.scriptName('transform')
	.options({
		d: {
			alias: 'datapath',
			description: 'path to data (json or yaml)',
			demand: true
		},
		f: {
			alias: 'filepath',
			description: 'path to your context definition'
		}
	})
	.normalize('d')
	.normalize('f')
	.command('$0 <datapath> [filepath]', 'process source with the current context', {}, command)
	.argv


