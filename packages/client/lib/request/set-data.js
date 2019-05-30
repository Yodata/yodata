const assert = require('assert-plus')
const setObjectValue = require('../util/set-object-value')
const getData = require('./get-data')
const putData = require('./put-data')

module.exports = setData

/**
 *
 *
 * @param {string} target - resource to update
 * @param {string} key - data key to update
 * @param {*} value - the value to update with
 * @returns {Promise}
 */
async function setData(target, key, value) {
	return getData(target)
		.then(setObjectValue(key, value))
		.then(putData(target))
}
