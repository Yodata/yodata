const buildoptions = require('./build-options')
const target = 'https://example.com/'
const data = { type: 'test' }

test('returns a request object', () => {
  const result = buildoptions(target, data, 'json')
  expect(result).toHaveProperty('body', JSON.stringify(data, null, 1))
  expect(result).toHaveProperty('headers.content-type', 'application/json')
})

test('accepts options object', () => {
  const result = buildoptions(target, data, { headers: { 'content-type': 'json' }, encoding: 'foo' })
  expect(result).toHaveProperty('body', JSON.stringify(data, null, 1))
  expect(result).toHaveProperty('headers.content-type', 'application/json')
  expect(result).toHaveProperty('encoding', 'foo')
})

test('throws on null or undefined data', () => {
  expect(() => buildoptions('test',null)).toThrow()
  expect(() => buildoptions('test',undefined,'json')).toThrow()
})

test('build.options yaml', () => {
  const result = buildoptions(target, data, 'yaml')
  console.log(result)
  expect(result).toHaveProperty('body', 'type: test\n')
  expect(result).toHaveProperty('headers.content-type', 'application/x-yaml')
})

test('build.options json', () => {
  const result = buildoptions(target, data)
  expect(result).toHaveProperty('headers.content-type', 'application/json')
  expect(result).toHaveProperty('body', JSON.stringify(data, null, 1))
})
