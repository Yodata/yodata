const yaml = require('../yaml')

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
	test('stringify', () => {
		const result = yaml.stringify(data)
		expect(typeof result).toBe('string')
	})

	test('parse', () => {
		const string = yaml.stringify(data)
		const result = yaml.parse(string)
		expect(result).toEqual(data)
	})
})
