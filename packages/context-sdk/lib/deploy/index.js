"use strict";
const client = require('@yodata/client')
const getContextInfo = require('../info')
const fs = require('fs')
const logger = require('@yodata/logger')

module.exports = deploy

async function deploy(props) {
	let { filepath, environment } = props
	const { context, pod } = await getContextInfo(props)
	if (!filepath) filepath = context.filepath
	const content = fs.readFileSync(filepath, 'utf8')

	logger.info(`deploying to ${context.url}`)

	return client.putData(context.url, {
		headers: {
			'content-type': context.contentType,
			'x-api-key': pod.secret
		},
		body: content
	}).then(response => {
		logger.info('OK')
	})
}
