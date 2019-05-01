"use strict";
const assert = require('assert-plus')
const client = require('@yodata/client')
const getContextInfo = require('../info')
const fs = require('fs')
const path = require('path')

module.exports = deploy

async function deploy(props) {
	const { context, pod } = await getContextInfo(props)
	let { filepath, environment } = props
	if (!filepath) filepath = context.filepath
	const content = fs.readFileSync(filepath, 'utf8')

	const target = context.url

	return client.putData(context.url, {
		headers: {
			'content-type': context.contentType,
			'x-api-key': pod.secret
		},
		body: content
	})
}
