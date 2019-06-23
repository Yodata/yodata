
describe('is-host', () => {
  const ishost = require('../is-host')
  test('true if host', () => {
    expect(ishost('example.com')).toBeTruthy()
    expect(ishost('dave.example.com')).toBeTruthy()
    expect(ishost('.com')).toBeFalsy()
    expect(ishost('com')).toBeFalsy()
    expect(ishost('')).toBeFalsy()
  })
})
