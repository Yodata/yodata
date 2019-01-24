'use strict'

const jsonata = require('jsonata')

const TOKEN = '@view'
const MAP_RESULT = 'MAP_RESULT'

module.exports = function (event, data) {
	if (event === MAP_RESULT && this.has(TOKEN)) {
		const expression = jsonata(this.get(TOKEN))
		return expression.evaluate(data)
	}
	return data
};
