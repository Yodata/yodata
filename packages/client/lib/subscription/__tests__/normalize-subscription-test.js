const config = require('@yodata/config')
const { normalizeSubscription } = require('../normalize-subscription')

const PROFILE = 'normalizesubscriptiontest'

beforeAll(() => {
	config.set('profile', PROFILE)
	config.profile.set('pod.url', 'https://bob.example.com')
})

afterAll(() => {
	config.delete(PROFILE)
})

describe('normalize.subscription', () => {

	it('works', () => {
		const agent = 'alice:profile/card#me'
		const object = 'domain/topic'
		const result = normalizeSubscription({ agent, object })
		expect(result).toHaveProperty('agent', 'https://alice.example.com/profile/card#me')
		expect(result).toHaveProperty('object', '/event/topic/domain/topic')
	})
})
