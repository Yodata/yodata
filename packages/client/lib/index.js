const createClient = require('./create-client')
const handleError = require('./handle-error')

exports.createClient = createClient
exports.event = require('./event')
exports.putData = putData
exports.getJson = getJson
exports.postJson = postJson
exports.get = require('./get')
exports.subscription = require('./subscription')

async function postJson(path, json) {
	return createClient()
		.post(path, { json: true, body: json })
		.catch(handleError)
}

async function putData(path, options) {
	return createClient()
		.put(path, options)
		.catch(handleError)
}

async function getJson(path) {
	return createClient()
		.get(path)
		.catch(handleError)
}

