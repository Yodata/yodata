const log = require('@yodata/logger')
const { mergeObjectValues } = require('../util')
const getData = require('./get-data')
const putData = require('./put-data')
const handleError = require('./handle-error')

module.exports = patchData

/**
 * Simulates a patch by getting target, merging data with provided object values and putting the resource
 * @param {string} target - resource to be updated
 * @param {object} object - data to be written to target.key
 * @returns {Promise<*>} httpResponse
 */
async function patchData(target, object) {
	return getData(target)
		.then(mergeObjectValues(object))
		.then(newState => putData(target, newState))
		.catch(handleError('patch-data'))
}
