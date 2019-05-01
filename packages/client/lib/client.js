const assert = require('assert-plus')
const mime = require('mime')
const config = require('@yodata/config')
const got = require('got')
const baseUrl = config.getProfileValue('pod.url')
const secret = config.getProfileValue('pod.secret')
const Yaml = require('js-yaml')
// @ts-ignore
const client = got.extend({
	baseUrl: baseUrl,
	headers: { 'x-api-key': secret }
})

exports.publish = publish
exports.putData = putData
exports.getJson = getJson
exports.postJson = postJson

async function publish(recipient, topic, data) {
	return postJson('/publish', { recipient, topic, data })
}

async function postJson(path, json) {
	return client
		.post(path, { body: JSON.stringify(json) })
		.then(parseJsonResponse)
		.catch(handleErrorResponse)
}

async function putData(path, options) {
	return client
		.put(path, options)
		.then(parseJsonResponse)
		.catch(handleErrorResponse)
}

async function getJson(path) {
	return client
		.get(path)
		.then(parseJsonResponse)
		.catch(handleErrorResponse)
}

async function parseJsonResponse(response) {
	const { statusCode, statusMessage, body } = response
	const result = { statusCode, statusMessage }
	result.contentType = response.headers['content-type']
	if (result.contentType === 'application/json') {
		result.data = JSON.parse(body)
	} else if (result.contentType.contains('yaml')) {
		result.data = Yaml.load(body)
	} else result.data = body
	return result
}

function handleErrorResponse(response) {
	const { statusCode, statusMessage, body } = response
	const result = { statusCode, statusMessage }
	const error = body || statusMessage
	result.error = error.message
	return result
}

async function returnData(response) {
	return (response.data) ? response.data : response
}
