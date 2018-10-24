'use strict'

const ua = require('universal-analytics')

const _ = require('lodash')
const uuid = require('uuid')
const pkg = require('../package.json')
const configstore = require('./configstore')
const logger = require('./logger')

let anonId = configstore.get('analytics-uuid')
if (!anonId) {
	anonId = uuid.v4()
	configstore.set('analytics-uuid', anonId)
}

const visitor = ua(process.env.YODATA_ANALYTICS_UA, anonId, {
	strictCidFormat: false,
	https: true
})

visitor.set('cd1', process.platform)
visitor.set('cd2', process.version)

module.exports = function(action, label, duration) {
	return new Promise(resolve => {
		if (!_.isString(action) || !_.isString(label)) {
			logger.debug('track received non-string arguments:', action, label)
			resolve()
		}
		duration = duration || 0

		if (configstore.get('tokens') && configstore.get('usage')) {
			visitor
				.event('Yodata CLI ' + pkg.version, action, label, duration)
				.send(() => {
					// We could handle errors here, but we won't
					resolve()
				})
		} else {
			resolve()
		}
	})
}
