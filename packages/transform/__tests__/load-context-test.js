const loadContext = require('../src/load-context')

describe('load-context', () => {
	test('yaml', () => {
		const context = loadContext('../examples/context-definition.yaml')
		expect(context.has('foo')).toBeTruthy()
	})

	test('json', () => {
		const context = loadContext('../examples/context-definition.json')
		expect(context.has('foo')).toBeTruthy()
	})

	test('js', () => {
		const context = loadContext('../examples/context-definition.js')
		expect(context.has('foo')).toBeTruthy()
	})
})
