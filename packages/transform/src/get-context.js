const yaml = require('js-yaml')
const got = require('got')
const Context = require('./context')
const loadContext = require('./load-context')

module.exports = getContext

/**
 * fetch and parse context from a file or via http
 *
 * @param {string} target
 * @param {object} [contextOptions]
 * @returns Context
 */
async function getContext(target, contextOptions) {
	if (typeof target === 'string' && target.startsWith('http')) {
		const cdef = await got(target)
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
						return response.body
				}
			})

		return new Context(cdef, contextOptions)
	} else {
		return loadContext(target, contextOptions)
	}
}
