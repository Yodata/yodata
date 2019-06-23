const isCurie = require('../is-curie')

describe('is-curie', () => {
  test('valid-curie = true', () => {
    expect(isCurie('user:test')).toBeTruthy()
  })
  test('is-curie invalid returns false', () => {
    // @ts-ignore
    expect(isCurie()).toBeFalsy()
    expect(isCurie('')).toBeFalsy()
    expect(isCurie('https://user.example.com/user:test')).toBeFalsy()
  })
})
