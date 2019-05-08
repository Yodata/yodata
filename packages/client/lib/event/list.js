'use strict'

const createClient = require('../create-client')
const get = require('../util/get-in-fp')

module.exports = listEvents

async function listEvents({ topic }) {
	return createClient()
		.get(`/event/topic/${topic}/`)
		.then(get('data.contains', []))
		.catch(response => {
			if (response.statusCode === 404) {
				return []
			} else {
				throw new Error('list.events')
			}
		})
}
