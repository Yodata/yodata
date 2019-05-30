const { getData } = require('..')
const nock = require('nock')

describe('get-data', () => {
	test('returns response.data', async () => {
		const target = 'http://example.com'
		const data = { type: 'data' }
		nock(target).get('/').reply(200, data)
		return expect(getData(target)).resolves.toEqual(data)
	})
	test('get-data(target,key)', async () => {
		const target = 'http://example.com'
		const key = 'key'
		const value = 'value'
		const data = { [key]: value }
		nock(target).get('/').reply(200, data)
		const response = await getData(target, `data.${key}`)
		return expect(response).toEqual(value)
	})
	test('key supports dot notation', async () => {
		const target = 'http://example.com'
		const key = 'key'
		const value = 'value'
		const data = { nested: { [key]: value } }
		nock(target).get('/').reply(200, data)
		const response = await getData(target, 'data.nested.key')
		return expect(response).toEqual(value)
	})
})
