const config = require('@yodata/config')
const nock = require('nock')
const list = require('../list')

const podurl = config.getProfileValue('pod.url', 'http://example.com')

describe('list', () => {
	test('returns subscription items', async () => {
		const subscription = {
			agent: 'https://bob.example.com/profile/card#me',
			object: '/event/'
		}
		nock(podurl)
			.get('/settings/subscriptions')
			.reply(200, {
				id: 'http://example.com',
				items: [subscription]
			})

		const response = await list()
		expect(response).toBeInstanceOf(Array)
		expect(response).toHaveLength(1)
		expect(response[0]).toEqual(subscription)
	})

	test('returns an empty list if no subs resource was found', async () => {
		nock(podurl)
			.get('/settings/subscriptions')
			.reply(404)

		const response = await list()
		expect(response).toBeInstanceOf(Array)
		return expect(response).toHaveLength(0)
	})
})

