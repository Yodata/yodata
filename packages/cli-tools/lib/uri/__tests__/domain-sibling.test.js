const sibling = require('../domain-sibling')

describe('uri.domain-sibling', () => {
  test('returns a sibling domain (replaces the first domain segment with the provided value', () => {
    expect(() => sibling('a', 'b.example.com')).toThrow()
    expect(() => sibling()).toThrow()
    expect(sibling('alice', 'https://bob.example.com/profile/card#me')).toEqual('https://alice.example.com')
    expect(sibling('alice', 'https://bob.example.com')).toEqual('https://alice.example.com')
    expect(sibling('a', 'https://b.example.com')).toEqual('https://a.example.com')
    expect(sibling('a.b', 'http://c.com')).toEqual('http://a.b.com')
  })
})
