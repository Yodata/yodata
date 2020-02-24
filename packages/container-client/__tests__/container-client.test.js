/** @format */

'use strict'

describe('@yodata/container-client', () => {
  const Container = require('..')
  const nock = require('nock')
  const clientName = 'container-client-test'
  const hostname = 'http://example.com'
  const hostkey = 'test'
  const pathname = '/a/b/'

  const testContainer = () =>
    new Container({ name: clientName, hostname, hostkey, pathname })
  const createMockMessage = id => ({ id })
  const createMockResponse = ids => {
    const contains = Array.isArray(ids) ? ids.map(createMockMessage) : []
    const response = {
      next: contains.length,
      contains
    }
    return response
  }

  test('constructor', () => {
    const hostname = 'http://example.com/a/b/'
    const hostkey = 'test'
    const container = new Container({ hostname, hostkey })
    expect(container).toHaveProperty('hostname', hostname)
    expect(container).toHaveProperty('hostkey', hostkey)
  })

  test('response handler', async () => {
    const hostname = 'http://example.com'
    const pathname = '/a/b/'
    const hostkey = 'test'
    const query = { format: 'full' }
    const expected = createMockResponse([1, 2])
    expect(expected).toHaveProperty('contains')
    expect(expected.contains).toHaveProperty('length', 2)

    const scope = nock(hostname)
      .get(pathname)
      .query(query)
      .reply(200, expected)

    const container = new Container({ hostname, hostkey, pathname })
    expect(container).toHaveProperty('hostname', hostname + pathname)

    const response = await container.list()
    expect(response).toHaveProperty('contains', expected.contains)
    return scope.done()
  })

  test('404 returns an empty list', async () => {
    const hostname = 'http://example.com'
    const pathname = '/inbox/'
    const hostkey = 'shh'
    const query = { format: 'full' }
    const container = new Container({ hostname, pathname, hostkey })

    const scope = nock(hostname)
      .get(pathname)
      .query(query)
      .reply(404)

    const result = await container.list()
    expect(result).toEqual({ contains: [] })
    return scope.done()
  })

  test('500 throws', async () => {
    const hostname = 'http://example.com'
    const pathname = '/inbox/'
    const hostkey = 'shh'
    const query = { format: 'full' }
    const container = new Container({ hostname, pathname, hostkey })

    const scope = nock(hostname)
      .get(pathname)
      .query(query)
      .replyWithError('internal error')

    await expect(container.list()).rejects.toThrowError()
    return scope.done()
  })
})
