'use strict'
const { loadData } = require('..')
const nock = require('nock')

describe('load-data', () => {
  test('yaml source', async () => {
    return expect(loadData('../examples/context-definition.yaml'))
      .resolves
      .toHaveProperty('foo', 'bar')
  })

  test('json source', async () => {
    return expect(loadData('../examples/context-definition.json'))
      .resolves
      .toHaveProperty('foo', 'bar')
  })

  test('js/javascript source', async () => {
    return expect(loadData('../examples/context-definition.js'))
      .resolves
      .toHaveProperty('foo', 'bar')
  })

  test('can get a yaml file via http', async () => {
    const id = 'http://transform.yaml.co'
    const scope = nock(id)
      .get('/')
    .reply(200,`
    $schema: foo
    `,{'content-type': 'application/x+yaml' })
    return expect(loadData(id))
      .resolves
      .toHaveProperty('$schema', 'foo')
  })

  test('parses a yaml context', async () => {
    const cdef = 'foo: bar'
    return expect(loadData(cdef))
      .resolves
      .toHaveProperty('foo', 'bar')
  })

  test('throws an error if http file does not exist', async () => {
    const context = loadData('http://example.com')
    return expect(context).rejects.toThrowError()
  })
})
