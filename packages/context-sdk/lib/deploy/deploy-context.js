#!/usr/bin/env node
const { client } = require('@yodata/cli')
const getContextInfo = require('../info/get-context-info')
const fs = require('fs')

getContextInfo()
	.then(info => {
		const { pod, path, contentType, url }
		const content = fs.readFileSync(path, 'utf8')
		client.put(url, {
			headers: {
				'content-type': contentType
			},
			body: content
		})
	})
