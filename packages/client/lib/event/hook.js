'use strict'
const assert = require('assert-plus')
const getHooks = require('./get-hooks')
const set = require('lodash/set')
const getSubscriptions = require('../subscription/get')

module.exports = async function ({ context, target, topic }) {
	assert.string(topic)
	assert.string(target)
	const hooks = await getHooks()
	if (context) {
		set(hooks, ['scope', topic, 'context'], context)
	}

}

