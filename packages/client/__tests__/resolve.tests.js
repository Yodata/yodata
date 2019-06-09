const Client = require('..')

describe('client.resolve', () => {
	const client = new Client({ hostname: 'https://bob.example.com' })

	test('resolves sibling', () => {
		const alice = 'alice:'
		expect(client.resolve(alice)).toEqual('https://alice.example.com/')
	})

	test('resolves curie', () => {
		const input = 'alice:profile/card#me'
		expect(client.resolve(input)).toEqual('https://alice.example.com/profile/card#me')
	})

	test('reslves path', () => {
		const path = '/path/to/something'
		expect(client.resolve(path)).toEqual('https://bob.example.com/path/to/something')
	})

	test('returns valid url unchanged', () => {
		const external = 'https://www.google.com'
		expect(client.resolve(external)).toEqual(external)
	})
})
