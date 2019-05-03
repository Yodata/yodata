#!/usr/bin/env node
'use strict'
const transform = require('../transform')
const { createCLIResponseHandler } = require('@yodata/cli')
const command = createCLIResponseHandler(transform)

require('yargs')
	.scriptName('transform')
	.command('$0 <datapath> <filepath>', 'process source with the current context', {}, command)
	.options({
		datapath: {
			description: 'path to json or yaml file',
			demand: true
		},
		filepath: {
			alias: 'filepath',
			description: 'path to your context definition',
			demand: true
		},
		inverse: {
			alias: 'in',
			default: false,
			type: 'boolean'
		}

	})
	.normalize('datapath')
	.normalize('filepath')
	.argv


