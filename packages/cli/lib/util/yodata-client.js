const assert = require('assert-plus')
const mime = require('mime')
const config = require('./configstore')
const got = require('got')
const baseUrl = config.getProfileValue('pod.url')
const secret = config.getProfileValue('pod.secret')
// @ts-ignore
const client = got.extend({
	baseUrl: baseUrl,
	headers: { 'x-api-key': secret }
})

exports.publish = publish


async function publish(recipient, topic, data) {
	return postJson('/publish', { recipient, topic, data })
}

async function postJson(path, json) {
	return client
		.post(path, { body: JSON.stringify(json) })
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
	result.data = JSON.parse(body)
	return result
}

function handleErrorResponse(response) {
	const { statusCode, statusMessage, body } = response
	const result = { statusCode, statusMessage }
	const error = JSON.parse(body)
	result.error = error.message
	return result
}

async function returnData(response) {
	return (response.data) ? response.data : response
}