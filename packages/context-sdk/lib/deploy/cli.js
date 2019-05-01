#!/usr/bin/env node
const client = require('@yodata/client')
const getContextInfo = require('../info/get-context-info')
const fs = require('fs')

getContextInfo()
	.then(info => {
		const { path, contentType, url } = info
		const content = fs.readFileSync(path, 'utf8')
		client.putData(url, {
			headers: {
				'Content-Type': contentType
			},
			body: content
		})
	})
