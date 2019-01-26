const sortObjectKeys = require('sort-object-keys')
const {intersection} = require('lodash')
const {MAP_RESULT} = require('../events')

const TOKEN = '@keyOrder'

module.exports = function keyOrderPlugin(event, object) {
	if (event === MAP_RESULT) {
		const defaultOrder = this.getOption(TOKEN, [])
		let order = this.get(TOKEN, defaultOrder)
		order = intersection(order, Object.keys(object))
		return sortObjectKeys(object, order)
	}

	return object
}
