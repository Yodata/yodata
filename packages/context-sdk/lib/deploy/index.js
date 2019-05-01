"use strict";
const assert = require('assert-plus')
const client = require('@yodata/client')
const getContextInfo = require('../info')
const fs = require('fs')

module.exports = deploy

async function deploy(props) {
	console.log(props)
	console.log('filepath', props.filepath)
	const context = await getContextInfo()
	const path = props.filepath || context.filepath
	const url = props.url || context.url
	const contentType = props.contentType || context.contentType
	const content = fs.readFileSync(path, 'utf8')

	assert.string(path)
	assert.string(url)
	assert.string(contentType)
	assert.string(content)

	return client.putData(url, {
		headers: {
			'content-type': contentType
		},
		body: content
	})
}
