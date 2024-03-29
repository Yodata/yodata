/* eslint-disable no-undef */

const Client = require('..')
const nock = require('nock')

describe('yodata-client', () => {
  test('is a class', () => {
    const hostname = 'https://test.extample.com'
    const hostkey = 'bar'
    const client = new Client({ hostname, hostkey })
    expect(client).toBeInstanceOf(Client)
    // expect(client).toHaveProperty('hostname', hostname)
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
    expect.assertions(3)
    const name = 'client.assign.test'
    const hostname = 'https://example.com'
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
    const hostname = 'https://example.com'
    const hostkey = 'secret'
    const client = new Client({ name, hostname, hostkey })
    const initialValue = () => ({ items: [1] })
    client.data = jest.fn().mockResolvedValue(initialValue())
    client.put = jest.fn().mockResolvedValue({ statusCode: 204 })
    const result = await client.set(hostname, 'items', [2])
    expect(client.data).toHaveBeenCalledWith(hostname, 'data', {})
    expect(client.put).toHaveBeenCalledWith(
      hostname,
      { items: [2] },
      { headers: { 'x-api-key': 'secret' } }
    )
    return result
  })

  test('client.put', async () => {
    const hostname = 'https://example.com'
    const hostkey = 'secret'
    const data = { type: 'test' }
    const target = '/foo/bar/baz'
    const headers = {
      'content-type': 'application/json',
      'x-api-key': hostkey
    }

    const scope = nock(hostname, {
      reqheaders: headers
    })
      .put(target, data)
      .reply(204)

    const options = {
      headers: { 'content-type': 'json' },
      encoding: 'binary'
    }
    const client = new Client({ hostname, hostkey })
    const response = await client.put(target, data, options)
    // expect(response).toHaveProperty('request') tdod: check if any depedencies exist
    expect(response).toHaveProperty('body')
    return scope.done()
  })

  test('client.put.curry - returns an async curried function when called with 1 param', () => {
    const target = 'https://example.com'
    const client = new Client()
    expect(client.put(target)).toBeInstanceOf(Function)
  })

  test('client.data - without key returns body', async () => {
    const target = 'https://example.com'
    const data = { type: 'test' }
    const scope = nock(target)
      .get('/')
      .reply(200, data)
    const client = new Client()
    const result = await client.data(target)
    expect(result).toEqual(data)
    return scope.done()
  })

  test('client.data - with key returns body.key-value', async () => {
    const target = 'https://example.com'
    const key = 'type'
    const data = { type: 'test' }
    const scope = nock(target)
      .get('/')
      .reply(200, data)
    const client = new Client()
    const result = await client.data(target, key)
    expect(result).toEqual(data[key])
    return scope.done()
  })

  test('client.data - key = "data" returns body', async () => {
    const target = 'https://example.com'
    const key = 'data'
    const data = { type: 'test' }
    const scope = nock(target)
      .get('/')
      .reply(200, data)
    const client = new Client()
    const result = await client.data(target, key)
    expect(result).toEqual(data)
    return scope.done()
  })

  test('client.data - key = "data.key" returns body.key same as without data', async () => {
    const target = 'https://example.com'
    const key = 'data.type'
    const data = { type: 'test' }
    const scope = nock(target)
      .get('/')
      .reply(200, data)
    const client = new Client()
    const result = await client.data(target, key)
    expect(result).toEqual(data.type)
    return scope.done()
  })

  test('client.data - 404 returns default value', async () => {
    const hostname = 'https://example.com'
    const target = '/'
    const data = { type: 'test' }
    const scope = nock(hostname)
      .get('/')
      .reply(404)

    const client = new Client({ hostname })
    const result = await client.data(target, 'data', data).catch(error => {
      console.error(error)
      return error
    })
    expect(result).toEqual(data)
    return scope.done()
  })

  test('client.addToCollection adds a value uniquly (I should have called this addToSet)', async () => {
    const hostname = 'https://addtocollection.com'
    const target = '/'
    const initialdata = { type: 'test', items: [] }
    const valueToAdd = { type: 'Thing', name: 'bob' }
    const afterdata = { type: 'test', items: [valueToAdd] }
    const initialLength = initialdata.items.length

    const scope = nock(hostname)
      .get(target)
      .reply(200, initialdata)
      .put(target, afterdata)
      .reply(204)

    const client = new Client({ hostname })
    const result = await client.addToCollection(target, 'items', valueToAdd)
    expect(result).toMatchObject(afterdata)
    expect(result).toHaveProperty('items.length', initialLength + 1)
    return scope.done()
  })

  test('client.addToCollection does not add duplicate values)', async () => {
    const hostname = 'https://addtocollectionuniquely.com'
    const target = '/'
    const thing1 = { name: 'thing1' }

    const initialdata = { items: [thing1] }
    const valueToAdd = { name: 'thing1' }
    const afterdata = { items: [thing1] }

    const scope = nock(hostname)
      .get(target)
      .reply(200, initialdata)

    const client = new Client({ hostname })
    const result = await client.addToCollection(target, 'items', valueToAdd)
    expect(result).toMatchObject(afterdata)
    expect(result).toHaveProperty('items.length', 1)
    return scope.done()
  })

  test('client.addToCollection supports string values)', async () => {
    const hostname = 'https://addstringtocollection.com'
    const target = '/'
    const thing1 = 'thing1'
    const thing2 = 'thing2'

    const initialState = { items: [thing1] }
    const valueToAdd = thing2
    const endState = { items: [thing1, thing2] }

    const scope = nock(hostname)
      .get(target)
      .reply(200, initialState)
      .put(target, endState)
      .reply(204)

    const client = new Client({ hostname })
    const result = await client.addToCollection(target, 'items', valueToAdd)
    expect(result).toMatchObject(endState)
    expect(result).toHaveProperty('items.length', endState.items.length)
    return scope.done()
  })

  test('client.addToCollection creates missing key)', async () => {
    const hostname = 'https://addstringtocollection.com'
    const target = '/'
    const thing1 = 'thing1'

    const initialState = { type: 'Thing' }
    const valueToAdd = thing1
    const endState = { type: 'Thing', items: [thing1] }

    const scope = nock(hostname)
      .get(target)
      .reply(200, initialState)
      .put(target, endState)
      .reply(204)

    const client = new Client({ hostname })
    const result = await client.addToCollection(target, 'items', valueToAdd)
    expect(result).toMatchObject(endState)
    expect(result).toHaveProperty('items.length', endState.items.length)
    return scope.done()
  })

  test('client.removeFromCollection)', async () => {
    const hostname = 'https://removefromcollection.com'
    const target = '/'
    const valueToRemove = { type: 'Thing', name: 'remove' }
    const valueToRetain = { type: 'Thing', name: 'retain' }
    const initialdata = { type: 'test', items: [valueToRetain, valueToRemove] }
    const afterdata = { type: 'test', items: [valueToRetain] }

    const scope = nock(hostname)
      .get(target)
      .reply(200, initialdata)
      .put(target, afterdata)
      .reply(204)

    const client = new Client({ hostname })
    const result = await client.removeFromCollection(target, 'items', valueToRemove)
    scope.done()
    expect(result).toMatchObject(afterdata)
  })
})
