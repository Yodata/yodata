'use strict'

const yaml = require('js-yaml')
const got = require('got')
const Context = require('./context')
const loadContext = require('./load-context')

module.exports = getContext

/**
 * fetch and parse context from a file or http url
 *
 * @param {string} target
 * @param {object} [contextOptions]
 * @returns {Promise}
 *
 */
async function getContext(target, contextOptions) {
	if (isURL(target)) {
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
						throw new Error(`context type not recognized ${contentType}`)
				}
			})
		return new Context(cdef, contextOptions)
	} else {
		return loadContext(target, contextOptions)
	}
}


function isURL(string) {
	return String(string).startsWith('http')
}
