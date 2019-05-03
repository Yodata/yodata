'use strict'

const Context = require('./context')

/**
 * @typedef ContextInstance
 * @property {function} map
 *
 */

/**
 * @param {ContextInstance} context
 */
module.exports = (context) => /**
	 * @param {object} data
	 * @param {object} [initialValue]
	 */
	async function mapAsync(data, initialValue) {
		const result = await context.map(data, initialValue)
		return result
	}
