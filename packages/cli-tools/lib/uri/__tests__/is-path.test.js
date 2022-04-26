const ispath = require('../is-path')

describe('is-path', () => {
  test('valid-path = true', () => {
    expect(ispath('/')).toBeTruthy()
    expect(ispath('/path/to/item')).toBeTruthy()
    expect(ispath('/path/to/item.json')).toBeTruthy()
    expect(ispath('settings/subscriptions')).toBeTruthy()
    expect(ispath('test')).toBeTruthy()
    expect(ispath('test/')).toBeTruthy()
  })
  test('is-path invalid returns false', () => {
    // @ts-ignore
    expect(ispath()).toBeFalsy()
    expect(ispath('https://example.com/path/to')).toBeFalsy()
    expect(ispath('https://user.example.com/user:test')).toBeFalsy()
    expect(ispath('test:test')).toBeFalsy()
    expect(ispath('test:path/to')).toBeFalsy()
  })
})
