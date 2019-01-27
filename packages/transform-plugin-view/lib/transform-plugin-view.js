// @ts-check
'use strict'

const jsonata = require('jsonata')
const mapValues = require('lodash/mapValues')
const reduce = require('lodash/reduce')

const VIEW = '@view'
const MAP_RESULT = 'MAP_RESULT'

/**
 * @param {string} event
 * @param {object} data
 */
module.exports = function (event, data) {
	let result
	switch (event) {
		case MAP_RESULT: {
			if (this.has(VIEW)) {
				const view = this.get(VIEW)
				result = mapValues(view, v => jsonata(v).evaluate(data))
			}
		}

			break
		default:
			result = data
	}

	console.log('transform-plugin-view', {event, data, result})
	return result
}
