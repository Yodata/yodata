const findInCollection = require('../find-in-collection')

describe('findincollection', () => {
	const a = { id: 1, name: 'a', type: 'item' }
	const b = { id: 2, name: 'b', type: 'item' }
	const c = { id: 3, name: 'c', type: 'item' }
	const collection = [a, b, c]

	test('returns an array', () => {
		const result = findInCollection(b, collection)
		return expect(result).toBeInstanceOf(Array)
	})

	test('returns all matching instances', () => {
		const result = findInCollection({ type: 'item' }, collection)
		return expect(result).toHaveLength(3)
	})

	test('is curryable', () => {
		const fn = findInCollection({ id: 1 })
		expect(fn).toBeInstanceOf(Function)
		const result = fn(collection)
		expect(result).toBeInstanceOf(Array)
		expect(result).toHaveLength(1)
	})
})
