/** @format */

'use strict'

const plugin = require('..')
function Context(view) {
  this.view = view
  this.has = key => {
    return String(key) === '@view'
  }
  this.get = key => {
    return String(key) === '@view' ? this.view : undefined
  }
}

describe('transform-plugin-view', () => {
  const data = () => ({
    '@context': 'http://schema.org',
    type: 'AskAction',
    instrument: 'http://example.com',
    agent: {
      '@type': 'Person',
      name: 'Bob',
      email: 'user@example.com'
    },
    recipient: {
      '@type': 'RealEstateAgent',
      '@id': 'https://465156.ds.bhhsresource.com/profile/card#me',
      name: 'Bruce Wayne',
      contactPoint: [
        {
          name: 'Home',
          telephone: '1-890-470-8932',
          email: 'user@example.com'
        },
        { name: 'Work', telephone: '944.404.8624' }
      ]
    }
  })
  const event = 'MAP_RESULT'
  test('select property name', () => {
    const context = new Context({ instrument: 'instrument' })
    const result = plugin('MAP_RESULT', data(), context)
    expect(result).toEqual({ instrument: 'http://example.com' })
  })
  test('default returns data unchanged', () => {
    const context = new Context()
    const d = data()
    const result = plugin('MAP_RESULT', d, context)
    expect(result).toEqual(d)
  })
  test('extend - removes view token bevore extending', () => {
    const context = new Context({
      '@view': '{ "foo": "bar" }'
    })
    const result = plugin('EXTEND', { target: { '@view': 'foo' } }, context)
    expect(result).not.toHaveProperty('@value')
  })
  test('select @property', () => {
    const context = new Context({ '@context': '$."@context"' })
    const result = plugin(event, data(), context)
    expect(result).toEqual({ '@context': 'http://schema.org' })
  })
  test('nested view', () => {
    const context = new Context('{"lead": {"type": type}}')
    const result = plugin(event, data(), context)
    expect(result).toEqual({ lead: { type: 'AskAction' } })
  })
  test('nested object view', () => {
    const context = new Context({ 'lead.type': 'type' })
    const result = plugin(event, data(), context)
    expect(result).toEqual({ lead: { type: 'AskAction' } })
  })
})
