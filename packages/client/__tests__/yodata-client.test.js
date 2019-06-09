const Client = require('..')

describe('yodata-client', () => {
  let originalhostname
  let originalhostkey
  const testhost = 'http://example.com'
  const testkey = 'secret'

  beforeAll(() => {
    originalhostname = process.env.YODATA_POD_URL
    originalhostkey = process.env.YODATA_POD_SECRET
    process.env.YODATA_POD_URL = testhost
    process.env.YODATA_POD_SECRET = testkey
  })

  afterAll(() => {
    process.env.YODATA_POD_URL = originalhostname
    process.env.YODATA_POD_SECRET = originalhostkey
  })

  test('is a class', () => {
    const hostname = 'foo'
    const hostkey = 'bar'
    const client = new Client({ hostname, hostkey })
    expect(client).toBeInstanceOf(Client)
    expect(client).toHaveProperty('hostname', hostname)
  })

  test('interface', () => {
    const client = new Client()
    expect(client).toHaveProperty('hostname', testhost)
    expect(client).toHaveProperty('hostkey', testkey)
    expect(client.http).toBeInstanceOf(Function)
    expect(client.get).toBeInstanceOf(Function)
  })

  test('plugin interface', () => {
    const client = new Client()
    const plugin = i => {
      i.foo = 'bar'
      return i
    }

    client.use(plugin)
    return expect(client).toHaveProperty('foo', 'bar')
  })
})
