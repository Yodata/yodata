const got = require('got')
const getOptions = require('./request-options')

module.exports = createClient

function createClient(options) {
	return got.extend(getOptions(options))
}
