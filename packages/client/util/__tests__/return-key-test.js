/* eslint-disable no-undef */
const returnKey = require('../return-key')
let object

beforeEach(() => {
  object = {
    a: 1,
    b: 2,
    c: {
      d: 3
    }
  }
})

test('returns a function', () => {
  expect(typeof returnKey('a')).toBe('function')
})

test('returns a key', () => {
  return expect(returnKey('a')(object)).toBe(object.a)
})

test('returns a dot.property', () => {
  return expect(returnKey('c.d')(object)).toBe(object.c.d)
})

test('accepts a default value', () => {
  const existingKey = 'a'
  const key = 'why'
  const defaultValue = 'Because I Said So!'
  expect(returnKey([key, defaultValue])(object)).toBe(defaultValue)
  expect(returnKey([existingKey, defaultValue])(object)).toBe(object[existingKey])
})
