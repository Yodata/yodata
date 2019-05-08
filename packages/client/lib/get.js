const get = require('./util/get-in-fp')
const createClient = require('./create-client')

module.exports = async function (target, options) {
	return createClient()
		.get(target, options)
		.then(get('data'))
}
