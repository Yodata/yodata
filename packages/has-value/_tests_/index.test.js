const has = require('..')

test('returns true if object has key', () => {
  const keyname = 'key'
  const value = true
  const object = { [ keyname ]: value }
  expect(has(object, keyname)).toBeTruthy()
})

test('returns false if object does not have key', () => {
  const keyname = 'key'
  const value = true
  const object = {}
  expect(has(object, keyname)).toBeFalsy()
})

test('comparator can be a string', () => {
  expect.assertions(2)
  const keyname = 'key'
  const value = 'string'
  const object = { [ keyname ]: value }
  expect(has(object, keyname, value)).toBeTruthy()
  expect(has(object, keyname, 'another string')).toBeFalsy()
})

test('comparator can be a boolean', () => {
  expect.assertions(2)
  const keyname = 'key'
  const value = false
  const object = { [ keyname ]: value }
  expect(has(object, keyname, false)).toBeTruthy()
  expect(has(object, keyname, true)).toBeFalsy()
})

test('comparator can be a function', () => {
  expect.assertions(2)
  const keyname = 'key'
  const goodvalue = 1
  const badvalue = true
  const comparator = jest.fn(value => {
    return (
      typeof value === 'number' &&
      value < 5
    )
  })
  expect(has({ [ keyname ]: goodvalue }, keyname, comparator)).toBeTruthy()
  expect(has({ [ keyname ]: badvalue }, keyname, comparator)).toBeFalsy()
})

test('key can be in dot notation', () => {
  expect.assertions(2)
  const keypath = 'a.b'
  const value = 1
  const object = { a: { b: value } }
  expect(has(object, keypath, value)).toBeTruthy()
  expect(has(object,'a.c',value)).toBeFalsy()
})
