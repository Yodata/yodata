'use strict'
const request = require('../request')
const { cache } = require('../util')
const sort = require('./sort-inbox-items')
const history = require('./history')
const href = require('./href')

module.exports = listInboxItems

/**
 * Gets the list of inbox items from the last read position
 * @param {object} [props] - the token to start from
 * @param {string} [props.from] - the token to start from
 * @param {string} [props.by] - the token to start from
 * @param {string} [props.last] - start from last token
 * @returns {Promise<any[]>} - array of inbox messages
 */
async function listInboxItems(props) {
	const from = (props && props.from) || history.last()
	let data

	if (cache.has(from)) {
		console.log('Showing data from cache. To clear cache enter $ yodata inbox reset .\n')
		data = cache.get(from)
	} else {
		let target = href()
		if (typeof from === 'string' && from.length > 0) {
			target += `?from=${from}`
		}

		data = await request.data(target)
	}

	const { next, contains } = data
	const result = sort(['timestamp'], contains)
	history.update(from, next)
	cache.set(from, { next, contains: result })

	// @ts-ignore
	return result
}
