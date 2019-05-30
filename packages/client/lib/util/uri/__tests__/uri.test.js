const config = require('@yodata/config')
const uri = require('..')

const restore = []

beforeAll(() => {
	restore.push(['profile', config.get('profile')])
	restore.push(['test.pod.url', config.get('test.pod.url')])
	config.set('profile', 'test')
	config.set('test.pod.url', 'https://bob.example.com')
})

afterAll(() => {
	restore.forEach(kv => {
		const [key, val] = kv
		config.set(key, val)
	})
})

describe('uri', () => {
	test('is-curie', () => {
		expect(uri.isCurie('alice:')).toBeTruthy()
		expect(uri.isCurie('')).toBeFalsy()
		expect(uri.isCurie(':')).toBeFalsy()
		expect(uri.isCurie()).toBeFalsy()
		expect(uri.isCurie(' : ')).toBeFalsy()
	})

	test('resolves sibling', () => {
		const input = 'alice:'
		expect(config.profileGet('pod.url')).toEqual('https://bob.example.com')
		expect(uri.isCurie(input)).toBeTruthy()
		expect(uri.resolve(input)).toEqual('https://alice.example.com/')
	})

	test('resolves curie', () => {
		const input = 'alice:profile/card#me'
		expect(uri.isValidUrl(input)).toBeFalsy()
		expect(uri.isPath(input)).toBeFalsy()
		expect(uri.isHost(input)).toBeFalsy()
		expect(uri.isCurie(input)).toBeTruthy()
		expect(uri.resolve(input)).toEqual('https://alice.example.com/profile/card#me')
	})

	test('reslves path', () => {
		const path = '/path/to/something'
		expect(uri.isValidUrl(path)).toBeFalsy()
		expect(uri.isPath(path)).toBeTruthy()
		expect(uri.resolve('/path/to/something')).toEqual('https://bob.example.com/path/to/something')
	})

	test('returns valid url unchanged', () => {
		expect(uri.resolve('https://www.google.com')).toEqual('https://www.google.com')
	})

	test('validates input', () => {
		// @ts-ignore
		expect(() => uri.resolve()).toThrow()
		// @ts-ignore
		expect(() => uri.resolve(1)).toThrow()
	})
})
