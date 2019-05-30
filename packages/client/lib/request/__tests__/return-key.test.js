const { returnKey } = require('..')

test('is a function', () => {
	return expect(returnKey).toBeInstanceOf(Function)
})

test('returns a function', () => {
	const fn = returnKey('data')
	return expect(fn).toBeInstanceOf(Function)
})

test('function returns the key of an object value', () => {
	const fn = returnKey('name')
	expect(fn({ name: 'test1' })).toEqual('test1')
	const getValue = jest.fn().mockResolvedValue({ name: 'test' })
	return expect(getValue().then(fn)).resolves.toEqual('test')
})

test('supports dot notation', () => {
	const fn = returnKey('nested.value')
	const value = { nested: { value: 'test1' } }
	expect(fn(value)).toEqual('test1')
	const getValue = jest.fn().mockResolvedValue(value)
	return expect(getValue().then(fn)).resolves.toEqual('test1')
})
