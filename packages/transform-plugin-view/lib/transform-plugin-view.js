//@ts-check
'use strict'

const jsonata = require('jsonata')

const TOKEN = '@view'
const MAP = 'MAP'
const MAP_RESULT = 'MAP_RESULT'
const DEPTH = 'DEPTH'

module.exports = function (event, data) {
	let result
	switch(event) {
		case MAP_RESULT: {
			if (this.has(TOKEN)) {
				const expression = jsonata(this.get(TOKEN))
				result = expression.evaluate(data)
			}
		}
		break
		default: {
			result = data
		}
	}
	console.log('transform-plugin-view', {event,data,result})
	return result
}
