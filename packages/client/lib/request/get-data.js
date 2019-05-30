const get = require('./get')
const returnKey = require('./return-key')

module.exports = getData

/**
 * Fetch, parse and query keys on a json or yaml resource.
 *
 * @param {string} target - path (from the current profile.pod.orgin) or fully qualified href
 * @param {string|string[]} [key] - data key to return
 * @param {*} [defaultValue] - value to return if data[key] is null/undefined
 * @returns {Promise<object|undefined>} - request result
 */
async function getData(target, key = 'data', defaultValue) {
	return get(target)
		.then(returnKey(key, defaultValue))
}
