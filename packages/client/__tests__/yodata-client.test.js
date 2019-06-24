const Client = require('..')

describe('yodata-client', () => {
  test('is a class', () => {
    const hostname = 'foo'
    const hostkey = 'bar'
    const client = new Client({ hostname, hostkey })
    expect(client).toBeInstanceOf(Client)
    expect(client).toHaveProperty('hostname', hostname)
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

  test('client.assign', async () => {
    const name = 'client.assign.test'
    const hostname = 'http://example.com'
    const hostkey = 'secret'
    const client = new Client({ name, hostname, hostkey })
    const newData = { id: 2, something: 'else' }
    client.data = jest.fn().mockResolvedValue({ id: 1, name: 'original' })
    client.put = jest.fn().mockResolvedValue({ statusCode: 204 })
    const result = await client.assign(hostname, newData)
    expect(client.data).toHaveBeenCalledWith(hostname, 'data', {})
    expect(client.put).toHaveBeenCalledTimes(1)
    expect(client.put).toHaveBeenCalledWith(hostname, {
      id: 2,
      name: 'original',
      something: 'else'
    })
    return result
  })

  test('client.set', async () => {
    const name = 'client.set.test'
    const hostname = 'http://example.com'
    const hostkey = 'secret'
    const client = new Client({ name, hostname, hostkey })
    const initialValue = () => ({ items: [1] })
    client.data = jest.fn().mockResolvedValue(initialValue())
    client.put = jest.fn().mockResolvedValue({ statusCode: 204 })
    let result = await client.set(hostname, 'items', [2])
    expect(client.data).toHaveBeenCalledWith(hostname, 'data', {})
    expect(client.put).toHaveBeenCalledWith(hostname, { items: [2] })
    return result
  })
})
