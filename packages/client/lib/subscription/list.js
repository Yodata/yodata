'use strict'

const createClient = require('../create-client')
const get = require('../util/get-in-fp')

module.exports = listSubscriptions

async function listSubscriptions() {
	return createClient()
		.get('/settings/subscriptions')
		.then(get('data.items', []))
		.catch(response => {
			if (response.statusCode === 404) {
				console.warn('list.subscriptions.not-found')
				return []
			} else {
				console.error('list.subscriptions.failed')
				throw new Error('list.subscriptions.failed')
			}
		})
}
