'use strict'
const assert = require('assert-plus')
const createClient = require('../create-client')
const loadData = require('../util/load-data')
const path = require('path')

module.exports = publish

/**
 * publish an event
 * @param {object} props
 * @param {string} [props.recipient]
 * @param {string} [props.topic]
 * @param {object} [props.data]
 * @param {string} [props.filepath]
 * @returns {Promise}
 */
async function publish(props) {
	const message = getData(props)
	return createClient()
		.post('/publish/', {
			json: true,
			body: message
		})
}


function getData(props) {
	if (props.filepath) {
		return loadData(path.resolve(props.filepath))
	}
	return props
}


function validate(props) {
	const { recipient, topic, data } = props
	assert.string(recipient)
	assert.string(topic)
	assert.object(data)
	assert.string(data.type, 'data.type')
	return props
}