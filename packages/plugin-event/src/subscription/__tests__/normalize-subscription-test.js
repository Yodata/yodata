const config = require('@yodata/config')
const { normalizeSubscription } = require('../normalize-subscription')

const PROFILE = 'normalizesubscriptiontest'

beforeAll(() => {
  const name = PROFILE
  if (!config.hasProfile(name)) {
    const hostname = 'https://bob.example.com'
    const hostkey = 'secret'
    config.addProfile({ name, hostname, hostkey })
  }

  config.useProfile(PROFILE)
})

afterAll(() => {
  config.removeProfile(PROFILE)
})

describe('normalize.subscription', () => {
  it('works', () => {
    const agent = 'alice:profile/card#me'
    const object = 'domain/topic'
    const host = 'https://bob.example.com'
    const result = normalizeSubscription({ agent, object, host })
    expect(result).toHaveProperty('agent', 'https://alice.example.com/profile/card#me')
    expect(result).toHaveProperty('object', '/event/topic/domain/topic')
  })
})
