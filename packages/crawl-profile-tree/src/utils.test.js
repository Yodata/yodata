const { onKey } = require('./utils')

test('util.onkey validates key', () => {
  expect(() => onKey()).toThrow('')
  expect(() => onKey(1)).toThrow('string')
  expect(() => onKey({})).toThrow('string')
  expect(() => onKey('string')).toThrow('(func) is required')
})
