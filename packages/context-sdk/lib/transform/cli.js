#!/usr/bin/env node
'use strict'
const transform = require('../transform')
const { print } = require('@yodata/cli')

require('yargs')
	.scriptName('transform')
	.options({
		o: {
			alias: 'output',
			describe: 'output format json | yaml'
		}
	})
	.command('$0 <datapath> [filepath]', 'process source with the current context', {}, print.command(transform))
	.options({
		datapath: {
			description: 'path to json or yaml file',
			demand: true
		},
		filepath: {
			alias: 'filepath',
			description: 'path to your context definition',
			default: 'cdef.yaml'
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

