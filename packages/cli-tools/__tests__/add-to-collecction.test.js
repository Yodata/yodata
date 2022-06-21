const { addToCollection } = require('..')

describe('addToCollection', () => {
  it('is a function', () => {
    expect(addToCollection).toBeInstanceOf(Function)
  })
  it('works with strings', () => {
    let value = 'test'
    let collection = []
    let a = addToCollection(collection, value)
    let b = addToCollection(a, 'test')
    expect(a).toEqual([ 'test' ])
    // does not add duplicate
    expect(b).toEqual([ 'test' ])
    // does alter the oroginal collection
    expect(collection).toEqual([ 'test' ])
  })
  it('works with objects', () => {
    let a = { id: 1, name: 'a' }
    let b = { id: 1, name: 'a' }
    let collection = addToCollection([],a)
    expect(collection).toEqual([a])
    expect(collection).toEqual([ b ])
    expect(collection).toEqual([ { id: 1, name: 'a' } ])
    collection = addToCollection(collection, b)
    expect(collection).toHaveLength(1)
  })

})
