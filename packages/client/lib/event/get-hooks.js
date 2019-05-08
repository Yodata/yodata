'use strict'
const client = require('../create-client')
const get = require('../util/get-in-fp')
const find = require('../util/find-fp')

const defaultValue = {
	id: 'hooks',
	object: '/inbox/',
	scope: {}
}

module.exports = async function getHooks() {
	return client()
		.get('/settings/subscriptions')
		.then(get('data.items'))
		.then(find({ id: 'hooks' }))
		.then(hooks => {
			return hooks || defaultValue
		})
		.catch(error => {
			console.error(error)
			return defaultValue
		})
}


