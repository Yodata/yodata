const { putData } = require('..')
const nock = require('nock')

describe('put-data', () => {
	test('calls http.put with json stringified body', async () => {
		const target = 'http://example.com'
		const data = { type: 'data' }
		nock(target).put('/', data).reply(201)
		return expect(putData(target, data)).resolves.toHaveProperty('statusCode', 201)
	})
	test('is curryable', async () => {
		const target = 'http://example.com'
		const data = { type: 'data' }
		nock(target).put('/', data).reply(201)
		const fn = putData(target)
		expect(fn).toBeInstanceOf(Function)
		// @ts-ignore
		const result = fn(data)
		return expect(result).resolves.toHaveProperty('statusCode', 201)
	})
})
