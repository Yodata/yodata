const config = require('@yodata/config')
const { add } = require('..')
let currentProfile

beforeAll(() => {
	config.delete('subtest')
	config.set('subtest', {
		pod: {
			url: 'http://example.com',
			secret: 'xxx'
		}
	})
	currentProfile = config.profile.name()
})

describe('subscription.add', () => {
	it('should add a valid subscription', () => {

	})
})
