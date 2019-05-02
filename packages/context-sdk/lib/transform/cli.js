'use strict'
const getContextInfo = require('../info')
const transform = require('.')
const logger = require('../util/logger')

require('yargs')
	.scriptName('transform')
	.command('$0 <datapath>', 'process source with the current context', {
		datapath: {
			description: 'path to data',
			type: 'string'
		}
	}, async props => {
		const info = await getContextInfo()
		const filepath = info.context.filepath
		const datapath = props.datapath
		logger.info({ filepath, datapath })
		const result = await transform(info.context.filepath, props.datapath)
		logger.info(result)
	})
