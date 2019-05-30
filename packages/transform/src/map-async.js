'use strict'

module.exports = context => async (data, initialValue) => {
	return context.map(data, initialValue)
}

