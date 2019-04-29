const deeks = require('deeks')
const doc = require('doc-path')
const flatten = require('lodash/flatMapDeep')

function generateContext(input = {}) {
	const keys = deeks.deepKeys(
		input,
		{
			expandArrayObjects: true,
			ignoreEmptyArraysWhenExpanding: true
		}
	)
	let result = ''
	keys.forEach(function (key) {
		result += `${key}\n`
	})
	console.log(result)
	return result
}

module.exports = generateContext
