'use strict'
const Container = require('..')
const nock = require('nock')
const clientName = 'container-client-test'
const hostname = 'http://example.com'
const hostkey = 'test'
const pathname = '/a/b/'

const testContainer = () => new Container({ name: clientName, hostname, hostkey, pathname })
const createMockMessage = id => ({ id })
const createMockResponse = ids => {
  const contains = Array.isArray(ids) ? ids.map(createMockMessage) : []
  const response = {
    next: contains.length,
    contains
  }
  return response
}

describe('@yodata/container-client', () => {
  test('constructor', () => {
    const container = testContainer()
    expect(container).toHaveProperty('name', clientName)
    expect(container).toHaveProperty('hostname', 'http://example.com/a/b/')
  })

  test('response handler', async () => {
    const container = testContainer()
    const response = createMockResponse([1, 2])
    expect(response).toHaveProperty('contains')
    expect(response.contains).toHaveProperty('length', 2)

    nock(container.hostname)
      .get('/?format=full')
      .reply(200, response)

    const result = await container.list()
    return expect(result).toEqual(response)
  })

  test('404 returns an empty list', async () => {
    const container = testContainer()

    nock(container.hostname)
      .get('/?format=full')
      .reply(404, 'not found')

    const result = await container.list()
    return expect(result).toEqual({ contains: [] })
  })

  test('500 throws', async () => {
    const container = testContainer()

    nock(container.hostname)
      .get('/?format=full')
      .reply(500, 'server error')

    const result = container.list()
    expect(result).rejects.toThrowError()
  })
})
