'use strict'

const crawl = require('..')
const TARGET_DIRECTORY = '../__test_data__/'

describe('@yodata/crawl-json-files', () => {
	it('response', () => {
		const result = crawl.crawlJsonFiles(TARGET_DIRECTORY)
		// expect(result).toBeInstanceOf(Object)
		// expect(result).toHaveProperty('source', TARGET_DIRECTORY)
		// expect(result).toHaveProperty('count', 3)
		// expect(result).toHaveProperty('keys', ['a', 'b', 'c', 'd', 'id', 'x', 'x.y'])
	});
})
