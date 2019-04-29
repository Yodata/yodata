const {Spinner} = require('clui')
const yaml = require('js-yaml')

const toYAML = json => yaml.dump(json, {sortKeys: false, skipInvalid: true})

/**
 *
 *
 * @param {object|Promise<object>} value
 * @param {object} flags
 * @param {string} flags.output - yaml | json | [filepath]
 * @returns
 */
module.exports = async function print(value, flags) {
	const format = flags.output
	const isPromise = value instanceof Promise
	let output; let spinner
	if (isPromise) {
		spinner = new Spinner('loading...')
		spinner.start()
		output = await value
		spinner.stop()
	} else {
		output = value
	}

	switch (format) {
		case 'json':
			output = JSON.stringify(output)
			break
		case 'yaml':
			output = toYAML(output)
			break
		default:
			output = value
	}

	console.log(output)
}
