'use strict'

const viewPlugin = require('..')

describe('transform-plugin-view', () => {
  const data = (view) => ({
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
        { name: 'Home', telephone: '1-890-470-8932', email: 'user@example.com' },
        { name: 'Work', telephone: '944.404.8624' }
      ]
    },
    '@view': view
  })
  const event = 'MAP_RESULT'
  test('select property name', () => {
    const input = data({ instrument: 'instrument' })
    const result = viewPlugin(event, input)
    expect(result).toEqual({ instrument: 'http://example.com' })
  })
  test('select @property', () => {
    const input = data({ '@context': '$."@context"' })
    const result = viewPlugin(event, input)
    expect(result).toEqual({ '@context': 'http://schema.org' })
  })
  test('nested view', () => {
    const input = data('{"lead": {"type": type}}')
    const result = viewPlugin(event, input)
    expect(result).toEqual({ lead: { type: 'AskAction' } })
  })
  test('nested object view', () => {
    const input = data({ 'lead.type': 'type' })
    const result = viewPlugin(event, input)
    expect(result).toEqual({ lead: { type: 'AskAction' } })
  })
})
