const get = require('lodash/get')

module.exports = function (key, defaultValue) {
	return function (value) {
		return get(value, key, defaultValue)
	}
}

