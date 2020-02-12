/** @format */

const normalize = require('./normalize-headers')

const set = (object, key, value) => Object.assign(object, { [key]: value })

test('normalize-headers fixes key cases', () => {
  const headers = {}
  set(headers, 'X-API-KEY', 'foo')
  const result = normalize(headers)
  expect(result).toHaveProperty('x-api-key', 'foo')
})

test('normalize.headers operates on nested headers', () => {
  const headers = {}
  set(headers, 'Content-type', 'json')
  const options = { headers, body: 'test' }
  const result = normalize(options)
  expect(result).toHaveProperty('body', 'test')
  expect(result).toHaveProperty('headers.content-type', 'application/json')
})

test('normalize.headers expands content-type shortcodes', () => {
  const headers = {}
  set(headers, 'Content-Type', 'json')
  const options = { headers, body: 'test' }
  const result = normalize(options)
  expect(result).toHaveProperty('body', 'test')
  expect(result).toHaveProperty('headers.content-type', 'application/json')
  expect(normalize({ 'content-type': 'yaml' })).toHaveProperty('content-type', 'application/x-yaml')
})
