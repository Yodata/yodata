const history = require('./history')
const list = require('./list')

module.exports = async function ({ count = 1 }) {
	history.back(count)
	return list()
}
