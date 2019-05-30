const { patchData } = require('..')
const nock = require('nock')

describe('patch-data', () => {
	test('updates resource with new data', async () => {
		const target = 'http://example.com'
		const originalData = { id: 1, name: 'bob' }
		const input = { name: 'alice' }
		const expectedResult = { id: 1, name: 'alice' }
		nock(target)
			.get('/')
			.reply(200, originalData)

			.put('/', expectedResult)
			.reply(200)

		const result = await patchData(target, input)
		return expect(result).toHaveProperty('statusCode', 200)
	})
})
