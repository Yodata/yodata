const Context = require('../src/context')
const {ADDITIONAL_PROPERTIES, VALUE} = require('../src/terms')

describe('constructor', () => {
	test('new Context constructor - no context values are created by default', () => {
		const context = new Context()
		expect(context.cdef.size).toEqual(0)
	})
})

describe('.parseContext', () => {
	test('context.parseContext = same as parseContext (except it dispatches)', () => {
		const context = new Context()
		const object = {a: 'A'}
		const result = context.parseContext(object)
		const expected = {a: {id: 'A', name: 'a'}}
		expect(result).toEqual(expected)
	})
})

describe('.has', () => {
	test('has(string) - true if context includes key', () => {
		const context = new Context({a: 'A'})
		expect(context.has('a')).toBe(true)
		expect(context.has('b')).toBe(false)
	})

	test('has(path: Array<string>) - checks deeply', () => {
		const context = new Context({a: {context: {a: {name: 'a'}}}})
		expect(context.has('a.context')).toBeTruthy()
	})
})

describe('.mapKey', () => {
	test('mapKey(key, defaultValue) - returns defaultValue when key is not found', () => {
		const context = new Context()
		const defaultValue = 'bar'
		return expect(context.mapKey('foo', 'bar')).toEqual(defaultValue)
	})
	test('mapKey returns key if not in context and no default', () => {
		const context = new Context()
		expect(context.mapKey('a')).toBe('a')
	})
	test('context.mapKey(key: string) - returns cdef.key.key', () => {
		const context = new Context({a: 'A'})
		expect(context.mapKey('a')).toEqual('A')
	})
	test('map key array', () => {
		const keys = ['a', 'b', 'c']
		const context = new Context({
			a: 'A',
			b: 'B'
		})
		const expected = ['A', 'B', 'c']
		expect(keys.map(v => context.mapKey(v))).toEqual(expected)
	})
})

describe('.mapKeys', () => {
	test('mapKeys maps object keys', () => {
		const context = new Context({a: 'c', b: 'd'})
		expect(context.mapKeys({a: 1, b: 2})).toEqual({c: 1, d: 2})
	})
})

describe('.mapValue', () => {
	test('returns context[key][value] if found', () => {
		const context = new Context({a: {[VALUE]: 'bar'}})
		expect(context.mapValue('foo', 'a')).toEqual('bar')
	})

	test('calls .value functions with (value,key,object,context)', () => {
		const fn = jest.fn(props => `hello ${props.value}`)
		const context = new Context({a: {value: fn}})
		const result = context.map({a: 'b'})
		const expected = {
			value: 'b',
			key: 'a',
			object: {a: 'b'},
			context: {id: 'a', name: 'a', value: fn}
		}
		expect(fn).toHaveBeenCalledWith(expected)
		expect(result).toEqual({a: 'hello b'})
	})

	test('calls .val functions with {value, key, last, context}', () => {
		const fn = jest.fn(V => `hello ${V.value}`)
		const context = new Context({a: {val: fn}})
		const result = context.map({a: 'b'})
		expect(fn).toHaveBeenCalledWith({value: 'b', key: 'a', last: {a: 'b'}})
		expect(result).toEqual({a: 'hello b'})
	})
})

describe('.mapEntry', () => {
	test('mapEntry(key: string, value: any) => [nextKey, nextValue]', () => {
		const context = new Context({a: 'b'})
		return expect(context.mapEntry(['a', 1])).toEqual(['b', 1])
	})
})

describe('.extend', () => {
	test('extend(cdef) = merges a new context over the current context', () => {
		const contextA = new Context({a: 'a', b: 'b'})
		const contextB = contextA.extend({b: 'bb', c: 'c'})
		expect(contextB.toJSON()).toMatchObject({
			a: {
				id: 'a'
			},
			b: {
				id: 'bb'
			},
			c: {
				id: 'c'
			}
		})
	})

	test('extend(cdef) = does not mutate the primary context', () => {
		const contextA = new Context({a: 'A', b: {id: 'B'}})
		const expected = contextA.toJS()
		const contextB = contextA.extend({a: 'B', b: 'C'})
		expect(contextA.toJS()).toEqual(expected)
	})
})

describe('.fromYaml', () => {
	test('fromYaml.parse', () => {
		const yamlSrc = `
    a: A
    b:
      foo: bar
  `
		const jsonSrc = {
			a: 'A',
			b: {
				foo: 'bar'
			}
		}
		expect(Context.fromYaml(yamlSrc).toJS()).toEqual(new Context(jsonSrc).toJS())
	})

	test('fromYaml.context is functional', () => {
		const src = `
  Foo: foo
  Bar: bar
  `
		return expect(Context.fromYaml(src).map({Foo: 1, Bar: 1})).toEqual({
			foo: 1,
			bar: 1
		})
	})
})

describe('.isAllowed', () => {
	test('isAllowed - true by default', () => {
		const context = new Context()
		expect(context.isAllowed('a')).toBe(true)
	})

	test('allow property if context.option.allowsAdditionalProperties is true', () => {
		const context = new Context().setOption('@additionalProperties', true)
		expect(context.isAllowed('a')).toBe(true)
	})

	test('allow property if \'@allowsAdditionalProperties\' is true for the active context', () => {
		const context =
      new Context({'@additionalProperties': true})
      	.setOption('@additionalProperties', false)

		expect(context.getOption(ADDITIONAL_PROPERTIES)).toBe(false)
		expect(context.get(ADDITIONAL_PROPERTIES)).toBe(true)
		expect(context.isAllowed('a')).toBe(true)
	})
})

describe('.options', () => {
	test('setOptions(key, value) - set context option', () => {
		const context = new Context()
		expect(context.getOption('foo')).toBeUndefined()
		context.setOption('foo', 'bar')
		expect(context.getOption('foo')).toEqual('bar')
	})
	test('getOption(key) => returns value', () => {
		const data = {string: 'string', array: [1], number: 1, date: new Date(), object: {a: 1}}
		const context = new Context().setOption('foo', data)
		expect(context.getOption('foo')).toEqual(data)
	})
})

