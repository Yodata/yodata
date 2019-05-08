'use strict'

const createClient = require('../create-client')
const get = require('../util/get-in-fp')
const assert = require('assert-plus')


module.exports = updateSubscriptions

async function updateSubscriptions(doc) {
	assert.object(doc)
	assert.array(doc.items)
	return createClient()
		.put('/settings/subscriptions', { json: true, body: doc })
		.then(get('data'))
		.catch(error => {
			console.error(error)
			throw new Error('update.subscription.failed')
		})
}
