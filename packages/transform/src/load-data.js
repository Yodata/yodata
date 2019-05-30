'use strict'

const assert = require('assert-plus')
const fromHref = require('./from-href')
const isFile = require('./is-file')
const fromFile = require('./from-file')
const fromString = require('./from-string')
const isURL = require('./is-url')

module.exports = loadData

/**
 * Load data from a path to a yaml, json, js, or href
 * or, if not a path, try to parse the string as yaml/json
 *
 * @param {string} source
 * @returns {Promise<object>}
 */
async function loadData(source) {
	assert.string(source)
	let data
	if (isURL(source)) {
		data = await fromHref(source)
	} else if (isFile(source)) {
		data = fromFile(source)
	} else {
		data = fromString(source)
	}

	return data
}

