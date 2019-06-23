const nock = require('nock')
const list = require('../list')

const environment = {}

beforeAll(() => {
  environment.YODATA_PROFILE = process.env.YODATA_PROFILE
  environment.YODATA_POD_URL = process.env.YODATA_POD_URL
  environment.YODATA_POD_SECRET = process.env.YODATA_POD_SECRET

  process.env.YODATA_PROFILE = 'sub-list-test'
  process.env.YODATA_POD_URL = 'https://alice.example.com'
  process.env.YODATA_POD_SECRET = 'sub-list-test-secret'
})

afterAll(() => {
  process.env.YODATA_POD_SECRET = environment.YODATA_POD_SECRET
  process.env.YODATA_POD_URL = environment.YODATA_POD_URL
  process.env.YODATA_PROFILE = environment.YODATA_PROFILE
})

describe('list', () => {
  const publisher = 'https://alice.example.com'
  const subscriber = 'https://bob.example.com'

  test('returns subscription items', async () => {
    const subscription = {
      agent: `${subscriber}/profile/card#me`,
      object: '/event/'
    }
    nock(publisher)
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
    nock(publisher)
      .get('/settings/subscriptions')
      .reply(404)

    const response = await list()
    expect(response).toBeInstanceOf(Array)
    return expect(response).toHaveLength(0)
  })
})
