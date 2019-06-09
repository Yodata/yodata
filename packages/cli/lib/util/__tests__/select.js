const select = require('../select')

const data = {
  id: 1,
  b: [1, 2, 3],
  c: { id: 2, name: 'bob', email: 'bob@example.com' }
}

test('call with full params', () => {
  return expect(select('id', data)).toEqual(data.id)
})

test('supports curried params', () => {
  const fn = select('c.name')
  expect(fn).toBeInstanceOf(Function)
  return expect(fn(data)).toEqual(data.c.name)
})

test('array params picks result.object properties', () => {
  return expect(select(['id', 'c.name'], data)).toEqual({ id: 1, c: { name: 'bob' } })
})

test('throws if selector is undefined', () => {
  return expect(() => select(undefined, data)).toThrowError()
})
