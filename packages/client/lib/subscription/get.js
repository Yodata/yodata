'use strict'

const createClient = require('../create-client')
const get = require('../util/get-in-fp')

module.exports = async function getSubscriptions() {
	return createClient()
		.get('/settings/subscriptions')
		.then(get('data'))
		.catch(error => {
			console.warn('subscription settings not found.')
			return {
				items: []
			}
		})
}
