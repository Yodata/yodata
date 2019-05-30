/* eslint-disable no-undef */
const nock = require('nock')
const get = require('../get')

const podurl = 'http://example.com'

describe('get', () => {
	test('response schema', async () => {
		nock(podurl)
			.get('/')
			.reply(200, { type: 'test' })
		const response = await get(podurl)
		expect(response).toHaveProperty('statusCode', 200)
		expect(response).toHaveProperty('statusMessage')
		expect(response).toHaveProperty('contentType', 'application/json')
		expect(response).toHaveProperty('data.type', 'test')
	})

	test('parses json response', async () => {
		nock(podurl)
			.get('/')
			.reply(200, { type: 'test' })
		const result = await get(podurl)
		expect(result).toHaveProperty('data.type', 'test')
	})

	test('parses yaml response', async () => {
		nock(podurl)
			.get('/')
			.reply(200, 'type: test', { 'Content-Type': 'application/x-yaml' })

		const result = await get(podurl)
		expect(result).toHaveProperty('data.type', 'test')
	})

	test('404 rejects', async () => {
		nock(podurl)
			.get('/')
			.reply(404)

		const result = get(podurl)
		return expect(result).rejects.toHaveProperty('statusCode', 404)
	})

	test('403 rejects', async () => {
		nock(podurl)
			.get('/')
			.reply(403)

		const result = get(podurl)
		expect(result).rejects.toHaveProperty('statusCode', 403)
	})
})

