'use strict'

const { getData } = require('../request')
const pathFromTopic = require('./path-from-topic')

module.exports = listEvents

async function listEvents({ topic }) {
	const pathname = pathFromTopic(topic)
	return getData(pathname, 'data.contains')
}
