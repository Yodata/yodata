const parse = require('../parse')

test('parses YAML', () => {
	const input = `
  a: B
  c:
  - d
  - e
  `
	expect(() => parse(input)).not.toThrowError()
	expect(parse(input)).toBeInstanceOf(Object)
})

test('parses JSON', () => {
	const input = JSON.stringify({a: 1, b: 2})
	expect(() => parse(input)).not.toThrowError()
	expect(parse(input)).toBeInstanceOf(Object)
})

