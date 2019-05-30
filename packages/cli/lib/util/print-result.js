
const jsonStringify = require('json-stringify-safe')
const yaml = require('./yaml')
const logger = require('./logger')
const { toTable } = require('./table')

module.exports = printResult

/**
 * @typedef OutputOption
 * @property {string} json "json"
 * @property {string} yaml "yaml"
 * @property {string} table "table"
 *
 * writes input to console in various formats
 *
 * @param {object|Promise<object>} value
 * @param {object}        options
 * @param {OutputOption}  options.output - yaml | json | table
 */
async function printResult(value, options) {
	const message = (value instanceof Promise) ? await value.catch(handleError) : value
	const formattedResponse = formatResponse(message, options)
	logger.log(formattedResponse)
}

function formatResponse(value, options) {
	const { output } = options
	switch (output) {
		case 'json':
			return jsonStringify(value, null, 2)
		case 'yaml':
			return yaml.stringify(value)
		case 'table':
			return toTable(value)
		case 'text':
			return value
		default:
			return value
	}
}

function handleError(error) {
	return error.message
}
