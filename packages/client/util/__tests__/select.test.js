const select = require('../select')

describe('select', () => {
  const data = {
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
  const bob = {
    name: 'bob',
    email: 'bob@example.com'
  }
  const alice = {
    name: 'alice',
    email: 'alice@example.com'
  }

  test('supports string selector', () => {
    const result = select('type', data)
    return expect(result).toEqual({ type: 'Person' })
  })

  test('array selectors', () => {
    const result = select(['type', 'name'], data)
    return expect(result).toEqual({ type: 'Person', name: 'bob' })
  })

  test('array of objects', () => {
    const data = [bob, alice]
    expect(select('name', data)).toEqual([{ name: 'bob' }, { name: 'alice' }])
  })
})
