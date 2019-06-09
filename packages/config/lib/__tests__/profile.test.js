'use strict'

const config = require('../..')

const { Profile } = config

describe('@yodata/config', () => {
  const TEST_PROFILE = 'CONFIG_TEST'
  const TEST_POD_URL = 'http://example.com'
  const TEST_POD_SECRET = 'shh'

  let YODATA_PROFILE
  let YODATA_POD_URL
  let YODATA_POD_SECRET

  let profile

  beforeAll(() => {
    YODATA_PROFILE = process.env.YODATA_PROFILE
    YODATA_POD_URL = process.env.YODATA_POD_URL
    YODATA_POD_SECRET = process.env.YODATA_POD_SECRET

    process.env.YODATA_PROFILE = TEST_PROFILE
    process.env.YODATA_POD_URL = TEST_POD_URL
    process.env.YODATA_POD_SECRET = TEST_POD_SECRET

    profile = new Profile(TEST_PROFILE)
  })

  afterAll(() => {
    process.env.YODATA_PROFILE = YODATA_PROFILE
    process.env.YODATA_POD_URL = YODATA_POD_URL
    process.env.YODATA_POD_SECRET = YODATA_POD_SECRET
    profile.clear()
  })

  it('interface', () => {
    expect(profile).toHaveProperty('name', TEST_PROFILE)
    expect(profile).toHaveProperty('profile', TEST_PROFILE)
    expect(profile).toHaveProperty('hostname', TEST_POD_URL)
    expect(profile).toHaveProperty('url', TEST_POD_URL)
    expect(profile).toHaveProperty('hostkey', TEST_POD_SECRET)
    expect(profile).toHaveProperty('secret', TEST_POD_SECRET)
    expect(profile).toHaveProperty('all')
  })
})
