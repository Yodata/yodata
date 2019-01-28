// @ts-check
'use strict'

const jsonata = require('jsonata')
const mapValues = require('lodash/mapValues')
const unset = require('lodash/unset')

const VIEW = '@view'
const MAP_RESULT = 'MAP_RESULT'
const EXTEND = 'EXTEND'

/**
 * @param {string} event
 * @param {object} data
 */
module.exports = function (event, data) {
	let result = data
	if (this.has(VIEW)) {
		const view = this.get(VIEW)
		switch (event) {
			case EXTEND:
				unset(data, ['target', VIEW])
				break
			case MAP_RESULT:
				result = transform(data, view)
				console.log('transform-plugin-view', {event, data, result})
				break
			default:
				result = data
		}
	}

	return result
}

function transform(data, view) {
	let result
	switch (typeof view) {
		case 'string':
			result = jsonata(view).evaluate(data)
			break
		case 'object':
			result = mapValues(view, value => jsonata(value).evaluate(data))
			break
		default:
			result = data
	}

	return result
}
