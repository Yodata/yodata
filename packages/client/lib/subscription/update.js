'use strict'

const createClient = require('../create-client')
const get = require('../util/get-in-fp')


module.exports = updateSubscriptions

async function updateSubscriptions(doc) {
	return createClient()
		.put('/settings/subscriptions', { json: true, body: doc })
		.then(get('data'))
		.catch(error => {
			console.error(error)
			throw new Error('update.subscription.failed')
		})
}
