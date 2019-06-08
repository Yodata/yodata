'use strict'
const Profile = require('..')

describe('@yodata/config', () => {
	const TEST_PROFILE = 'CONFIG_TEST'
	const TEST_POD_URL = 'http://example.com'
	const TEST_POD_SECRET = 'shh'

	let YODATA_PROFILE
	let YODATA_POD_URL
	let YODATA_POD_SECRET

	let config

	beforeAll(() => {
		YODATA_PROFILE = process.env.YODATA_PROFILE
		YODATA_POD_URL = process.env.YODATA_POD_URL
		YODATA_POD_SECRET = process.env.YODATA_POD_SECRET

		process.env.YODATA_PROFILE = TEST_PROFILE
		process.env.YODATA_POD_URL = TEST_POD_URL
		process.env.YODATA_POD_SECRET = TEST_POD_SECRET

		config = new Profile(TEST_PROFILE)
	})

	afterAll(() => {
		process.env.YODATA_PROFILE = YODATA_PROFILE
		process.env.YODATA_POD_URL = YODATA_POD_URL
		process.env.YODATA_POD_SECRET = YODATA_POD_SECRET
		config.clear()
	});

	it('interface', () => {
		expect(config).toHaveProperty('name', TEST_PROFILE)
		expect(config).toHaveProperty('profile', TEST_PROFILE)
		expect(config).toHaveProperty('hostname', TEST_POD_URL)
		expect(config).toHaveProperty('url', TEST_POD_URL)
		expect(config).toHaveProperty('hostkey', TEST_POD_SECRET)
		expect(config).toHaveProperty('secret', TEST_POD_SECRET)
		expect(config).toHaveProperty('all')
	})

})
