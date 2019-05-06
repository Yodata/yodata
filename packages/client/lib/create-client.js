const got = require('got')
const getOptions = require('./get-options')

module.exports = createClient

function createClient(options) {
	return got.extend(getOptions(options))
}
