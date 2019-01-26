const set = require('lodash/set')
const Context = require('../src/context')

function mockPlugin(event, data) {
	return data
}

test('context.use(plugin) adds the plugin to context.plugin set', () => {
	const context = new Context()
	expect(context.plugins.size).toEqual(0)
	context.use(mockPlugin)
	expect(context.plugins.size).toEqual(1)
})

describe('context.dispatch', () => {
	test('.dispatch(event,data,context) calls plugins with (event,data,context)', () => {
		const plugin = jest.fn(mockPlugin)
		const context = new Context()
		context.plugins = context.plugins.add(plugin)
		const event = 'A'
		const data = {id: 1}
		context.dispatch(event, data, context)
		expect(plugin).toHaveBeenLastCalledWith(event, data, context)
	})
	test('.dispatch returns plugin response', () => {
		const data = {}
		const expected = {foo: 'bar'}
		const context = new Context()
		const returnExpectedValue = jest.fn().mockReturnValue(expected)
		context.plugins = context.plugins.add(returnExpectedValue)
		const result = context.dispatch('test', data)
		expect(result).toEqual({foo: 'bar'})
	})
})

describe('plugin.state immutable', () => {
	test('plugin can alter state', () => {
		const plugin = (event, data) => {
			if (event === 'test') {
				set(data, 'hello', event)
			}

			return data
		}

		const context = new Context()
		context.plugins = context.plugins.add(plugin)
		const data = {}
		const result = context.dispatch('test', data)
		expect(result).toEqual({hello: 'test'})
	})
	test('plugin mutations do not alter initial state', () => {
		const plugin = jest.fn((event, state) => {
			set(state, 'foo.value', event)
			return state
		})
		const context = new Context()
		context.plugins = context.plugins.add(plugin)
		const state = {foo: {value: 'one'}}
		const result = context.dispatch('two', state)
		expect(state).toEqual({foo: {value: 'one'}})
		expect(result).toEqual({foo: {value: 'two'}})
	})
})

