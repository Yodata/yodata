const mergeValues = require('lodash/merge')
const getData = require('./get-data')
const putData = require('./put-data')

module.exports = patch

/**
 * Merge current target data with values and updates (PUT) the result
 * @param {string} target - resource to be updated
 * @param {object} values - data to be written to target.key
 */
async function patch(target, values) {
	const data = getData(target)
	return putData(target, mergeValues(data, values))
}
