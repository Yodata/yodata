'use strict'

const callerPath = require('caller-path')
const Yaml = require('js-yaml')
const fs = require('fs-extra')
const path = require('path')
const got = require('got')

module.exports = loadData

/**
 *
 *
 * @param {string} filePath
 * @returns @instance Context
 */
function loadData(filePath) {
	const dirName = path.dirname(callerPath())
	const target = path.resolve(dirName, filePath)
	const extName = path.extname(target)
	let source
	let response
	switch (extName) {
		case '.yaml':
		case '.yml':
			source = fs.readFileSync(target, 'utf8')
			response = Yaml.load(source)
			break
		case '.json':
			source = fs.readFileSync(target, 'utf8')
			response = JSON.parse(source)
			break
		case '.js':
			response = require(target)
			break
		default:
			throw new Error(`unknown file type ${extName}`)
	}
	return response
}

