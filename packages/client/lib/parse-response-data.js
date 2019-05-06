const yaml = require('js-yaml')

module.exports = parseResponseData

async function parseResponseData(response) {
	const contentType = String(response.headers['content-type'])
	if (contentType.includes('json')) {
		response.data = JSON.parse(response.body)
	} else if (contentType.includes('yaml')) {
		response.data = yaml.load(response.body)
	}
	return response
}
