const sibling = require('../domain-sibling')

describe('uri.domain-sibling', () => {
  test('returns a sibling at the same pathname', () => {
    expect(sibling('alice', 'https://bob.example.com/profile/card#me')).toEqual('https://alice.example.com/profile/card#me')
    expect(sibling('alice', 'https://bob.example.com/foo')).toEqual('https://alice.example.com/foo')
  })
})
