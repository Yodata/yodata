const createClient = require('./create-client')

module.exports = get

async function get(target, options) {
	return createClient().get(target, options)
}
