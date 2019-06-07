const setObjectValue = require('../set-object-value')

describe('set-object-value', () => {
	const data = {
		type: 'Person',
		name: 'bob',
		email: 'bob@example.com',
		address: [
			{
				type: 'PostalAddress',
				streetAddress: '123 Main Street',
				addressRegion: 'Anywhere',
				addressLocality: 'Anytown',
				addressCountry: 'USA'
			}
		]
	}
	test('supports string selector', () => {
		const result = setObjectValue('name', 'Alice', data)
		return expect(result).toHaveProperty('name', 'Alice')
	})

	test('is curryable', () => {
		const fn = setObjectValue('email', 'alice@example.com')
		expect(fn).toBeInstanceOf(Function)
		const result = fn(data)
		return expect(result).toHaveProperty('email', 'alice@example.com')
	})
})
