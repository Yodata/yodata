const assert = require('assert-plus')
const print = require('./print-result')

module.exports = createResponseHandler

/**
 * Creates an async response handler
 *
 * @param {function} fn - function to be called
 * @param {string} [key] - function will be called with props[key] if not specified, the function will be called with the props object
 * @param {object} [context] - handlers used in print
 * @returns
 */
function createResponseHandler(fn, key, context) {
	// Assert.func(fn,'createResponseHandler:fn')
	return function (props) {
		const param = key ? props[key] : props
		print(fn(param), props, context)
	}
}
