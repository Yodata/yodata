
const { collectionIncludes } = require('..')

describe('collection-includes', () => {
  test('returns true if object is found in collection', () => {
    const item = { id: 1 }
    const collection = [item]
    return expect(collectionIncludes(collection, item)).toBe(true)
  })

  test('returns false if object is not found in collection', () => {
    const item = { id: 1 }
    const collection = []
    expect(collectionIncludes(collection, item)).toBe(false)
  })

  test('handles object equality', () => {
    const a = { id: 1, name: 'a' }
    const b = { name: 'a', id: 1 }
    const collection = [a]
    expect(collectionIncludes(collection, a)).toBe(true)
    expect(collectionIncludes(collection, b)).toBe(true)
  })
})
