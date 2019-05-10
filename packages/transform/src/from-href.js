const got = require('got')
const yaml = require('js-yaml')

module.exports = fromHref

async function fromHref(uri) {
	return await got(uri)
		.then(response => {
			const contentType = response.headers["content-type"]
			switch (contentType) {
				case 'application/x-yaml':
				case 'application/x-yml':
					return yaml.load(response.body)
				case 'application/json':
				case 'application/ld+json':
					return JSON.parse(response.body)
				default:
					throw new Error(`context type not recognized ${contentType}`)
			}
		})
}
