const { addToCollection } = require('..')

describe('add-to-collection', () => {
  test('adds object to array', () => {
    const collection = []
    const item = { id: 1 }
    const result = addToCollection(collection, item)
    expect(result).toBeInstanceOf(Array)
    expect(result).toHaveLength(1)
    expect(collection).toHaveLength(0)
  })
  test('does not add duplicate objects', () => {
    const a = { id: 1, name: 'a' }
    const b = { name: 'a', id: 1 }
    const collection = [a]
    addToCollection(collection, b)
    expect(collection).toHaveLength(1)
    addToCollection(collection, a)
    expect(collection).toHaveLength(1)
    expect(collection).not.toContain(b)
    // Unlike js sets
    const set = new Set(collection)
    set.add(b)
    expect(set).toContain(b)
  })
})
