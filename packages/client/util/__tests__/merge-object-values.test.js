const { mergeObjectValues } = require('..')

describe('merge-object-values', () => {
  test('assignes values to an object', () => {
    const v1 = { id: 1, name: 'bob' }
    const v2 = { id: 2, name: 'bob' }
    return expect(mergeObjectValues(v2, v1)).toEqual(v2)
  })

  test('does not mutate data', () => {
    const original = { id: 1, name: 'bob' }
    const v1 = JSON.parse(JSON.stringify(original))
    const v2 = { id: 2, name: 'bob' }
    const result = mergeObjectValues(v2, v1)
    expect(result).toEqual(v2)
    // Not ideal but should be fine for our use cases
    expect(v1).toEqual(original)
  })

  test('is curryable', () => {
    const v1 = { id: 1, name: 'bob' }
    const v2 = { id: 2, name: 'bob' }
    const fn = mergeObjectValues(v2)
    expect(fn).toBeInstanceOf(Function)
    const result = fn(v1)
    return expect(result).toEqual(v2)
  })
})
