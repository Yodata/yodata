
const Context = require('../src/context')
const {PLUGIN_INSTALLED, PARSE, MAP_RESULT, MAP, EXTEND} = require('../src/events')

const mockPlugin = jest.fn((event, state) => state)
const context = new Context().use(mockPlugin)

test('context.use(plugin) calls installed plugin with (PLUGIN_INSTALLED, options, context(this))', () => {
	const plugin = jest.fn()
	const event = PLUGIN_INSTALLED
	const ts = Date.now()
	const options = {id: ts}
	const context = new Context().use(plugin, options)
	expect(plugin).toHaveBeenCalledWith(event, options, context)
})

test('context.parse calls plugins with (PARSE, value, this)', () => {
	const cdef = {a: 'A'}
	context.parseContext(cdef)
	expect(mockPlugin).toHaveBeenLastCalledWith(PARSE, cdef, context)
})

test('context.map calls plugins with (MAP, data, {initialValue, context})', () => {
	const plugin = jest.fn(mockPlugin)
	const context = new Context({a: 'A'})
	context.plugins = context.plugins.add(plugin)
	const initialValue = undefined
	const event = MAP
	const data = {a: 1}
	context.map(data)
	expect(plugin).toHaveBeenCalledWith(event, data, {initialValue, context})
})

test('context.map calls plugins with (MAP_RESULT, result, this)', () => {
	const plugin = jest.fn(mockPlugin)
	const context = new Context({a: 'A'})
	context.plugins = context.plugins.add(plugin)
	const data = {a: 1}
	context.map(data)
	const expectedResult = {A: 1}
	expect(plugin).toHaveBeenLastCalledWith(MAP_RESULT, expectedResult, context)
})

test('context.extend calls plugins with (EXTEND, {object, target}, this)', () => {
	const object = {'@name': 'nextContext'}
	const target = context.toJS()
	context.extend(object)
	expect(mockPlugin).toHaveBeenLastCalledWith(EXTEND, {object, target}, context)
})

test('context.extend - current context plugins are moved to the new context', () => {
	const a = new Context().use(mockPlugin)
	const b = a.extend({})
	expect(a.plugins.size).toBe(1)
	expect(b.plugins.size).toBe(1)
})
