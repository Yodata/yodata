const { Spinner } = require('clui')
const yaml = require('js-yaml')

const toYAML = json => yaml.dump(json, { sortKeys: false, skipInvalid: true })
const assert = require('assert-plus')
const logger = require('./logger')

/**
 *
 *
 * @param {object|Promise<object>} value
 * @param {object} props
 * @param {string} props.output - yaml | json | [filepath]
 * @param {boolean} props.count - show the result count
 * @param {boolean} props.transform - transform result with context.transform
 * @param {boolean} props.p - transform result with context.transform
 * @param {object} [context] - optional context helpers
 * @returns
 */
module.exports = async function printResult(value, props, context) {
	const { count, p } = props
	const isPromise = value instanceof Promise
	let output; let spinner
	if (isPromise) {
		spinner = new Spinner('loading...')
		spinner.start()
		output = await value.catch(error => {
			logger.error('error', { error }); return error
		})
		spinner.stop()
	} else {
		output = value
	}

	output = transformResponse(output, props, context)
	if (p === true) {
		logger.error('publish not immplemented')
	}

	output = formatResponse(output, props)
	console.log(output)
	if (count && Array.isArray(value)) {
		console.log(`Count: ${value.length}`)
	}
}

/**
 * If options.transform is true, transform the result with context.transform
 *
 * @param {*} value
 * @param {object} options
 * @param {boolean} options.transform
 * @param {object} context
 * @param {function} [context.transform] - transformation handler
 */
function transformResponse(value, options, context) {
	if (options.transform === true) {
		assert.func(context.transform, 'context.transform')
		return context.transform(value)
	}

	return value
}

function formatResponse(value, options) {
	let result
	switch (options.output) {
		case 'json':
			result = JSON.stringify(value)
			break
		case 'yaml':
			result = toYAML(value)
			break
		default:
			result = value
	}

	return result
}
