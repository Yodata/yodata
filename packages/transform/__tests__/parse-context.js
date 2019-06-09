const Context = require('../src/context')
const { REMOVE } = require('../src/terms')
const { parse } = require('..')

const context = new Context()

test('key, value: string  => {id: value, name: key}', () => {
  expect(parse({ a: 'b' })).toEqual({
    a: { id: 'b', name: 'a' }
  })
})

test('key, value: container.id => { id, nest }', () => {
  const name = 'a'
  const nest = 'b'
  const id = 'c'
  expect(parse({ a: 'b.c' })).toEqual({
    a: { id, name, '@nest': nest }
  })
})

test('key, primitive => { name, type, value }', () => {
  const name = 'a'
  const type = 'Number'
  const value = 1
  const id = name
  expect(parse({ [name]: value })).toEqual({ [name]: { name, type, value, id } })
})

test('parse.function -> {value: fn}', () => {
  const fn = jest.fn()
  expect(parse({ a: fn })).toEqual({
    a: {
      id: 'a',
      name: 'a',
      value: fn
    }
  })
})

test('parse string: null - sets remove flag', () => {
  return expect(parse({ a: null })).toEqual({
    a: { name: 'a', id: 'a', [REMOVE]: true }
  })
})

test('parse array values', () => {
  expect(parse({ a: [1, 2, 3] })).toEqual({
    a: { name: 'a', id: 'a', type: 'Array', value: [1, 2, 3] }
  })
})

test('object values receive default properties name and id}', () => {
  expect(parse({ a: {} })).toEqual({ a: { name: 'a', id: 'a' } })
})

test('decorators are not modified (no default name/id)', () => {
  expect(parse({ '@foo': 'bar' })).toEqual({ '@foo': 'bar' })
  expect(parse({ '@foo': true })).toEqual({ '@foo': true })
  expect(parse({ '@foo': { foo: 'bar' } })).toEqual({ '@foo': { foo: 'bar' } })
})

test('object with sub-context', () => {
  const cdef = {
    a: {
      context: {
        a: 'A'
      }
    }
  }
  const expected = { a: { name: 'a', id: 'a', context: { a: 'A' } } }
  expect(parse(cdef)).toEqual(expected)
})

test('minimal valid object includes name and/or id', () => {
  expect(parse({ a: { name: 'a' } })).toEqual({ a: { name: 'a', id: 'a' } })
  expect(parse({ a: { id: 'A' } })).toEqual({ a: { name: 'a', id: 'A' } })
})

test('empty objects resolve to default {name: K, id: K}', () => {
  expect(parse({ a: {} })).toEqual({ a: { name: 'a', id: 'a' } })
})
