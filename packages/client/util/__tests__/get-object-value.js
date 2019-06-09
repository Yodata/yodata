const getObjectValue = require('../get-object-value')

describe('get-object-value', () => {
  const object = {
    type: 'Person',
    name: 'bob',
    email: 'bob@example.com',
    address: [
      {
        type: 'PostalAddress',
        streetAddress: '123 Main Street',
        addressRegion: 'Anywhere',
        addressLocality: 'Anytown',
        addressCountry: 'USA'
      }
    ]
  }
  test('returns value of key', () => {
    const result = getObjectValue('name', object)
    return expect(result).toEqual('bob')
  })

  test('key supports dot notation', () => {
    return expect(getObjectValue('address.0.type', object)).toEqual('PostalAddress')
  })

  test('key supports default value', () => {
    return expect(getObjectValue(['lastname', 'jones'], object)).toEqual('jones')
  })

  test('is curryable', () => {
    const fn = getObjectValue('type')
    const result = fn(object)
    expect(fn).toBeInstanceOf(Function)
    expect(result).toEqual('Person')
  })
})
