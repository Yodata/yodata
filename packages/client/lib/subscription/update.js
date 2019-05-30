'use strict'

const { createClient, handleError } = require('.')
const get = require('../util/get-object-value')
const assert = require('assert-plus')

module.exports = updateSubscriptions

async function updateSubscriptions(doc) {
	assert.object(doc)
	assert.array(doc.items)
	return createClient()
		.put('/settings/subscriptions', { json: true, body: doc })
		.then(get('data'))
		.catch(handleError)
}
