const Context = require('../src/context')
const context = new Context({
	a: 'A',
	b: () => 'B',
	c: {
		key: 'c',
		val: () => 'C-VALUE'
	}
})

test('has(key) - true if context maps the key or property', () => {
	expect(context.has('a')).toBeTruthy()
	expect(context.has('d')).toBeFalsy()
})

test('hasKey(key) - context handles the provided key', () => {
	expect(context.hasKey('b')).toBeTruthy()
})

test('hasVal(key) - context has a value handler', () => {
	expect(context.hasVal('c')).toBeTruthy()
	
})

test('mapKey(value)', () => {
	expect(context.mapKey('a')).toEqual('A')
	
})

test('mapKey(novalue) returns the passed value', () => {
	expect(context.mapKey('nada')).toEqual('nada')
	
})

test('mapVal(value)', () => {
	const ctx = new Context({b: () => 'B'})
	expect(ctx.mapVal('b')).toEqual('B')
	
})

test('empty context', () => {
	const context = new Context()
	const data = {
		a: 1
	}
	expect(context.map(data)).toEqual(data)
	
})

test('extend context', () => {
	const a = new Context({a: 'b'})
	const b = a.extend({c: 'd'})
	expect(b).toHaveProperty('cdef', {
		a: 'b',
		c: 'd'
	})
	
})

test('@initialValue', () => {
	const context = new Context({'@initialValue': {'@type': 'Thing'}})
	const data = {}
	expect(context).toHaveProperty('initialValue', {'@type': 'Thing'})
	expect(context.map(data)).toHaveProperty('@type', 'Thing')
	expect(context.map(data, {})).toHaveProperty('@type', 'Thing')
	expect(context.map(data, {'@type': 'Organization'})).toHaveProperty(
		'@type',
		'Organization'
	)
	expect(context.map([{name: 'bob'}])[0]).toMatchObject({
		'@type': 'Thing',
		name: 'bob'
	})
	
})

test('by default, keys and values pass through', () => {
	const context = new Context()
	const data = {
		key: 1,
		foo: 'bar'
	}
	expect(context.map(data)).toEqual(data)
	
})

test('maps keys', () => {
	const context = new Context({a: 'b'})
	const data = {a: 1}
	const result = {b: 1}
	expect(context.map(data)).toEqual(result)
	
})

test('maps values', () => {
	const context = new Context({a: 'b'})
	const data = {c: 'a'}
	expect(context.map(data)).toEqual({c: 'b'})
	
})

test('map sets', () => {
	const context = new Context({a: 'b', c: 'c'})
	const data = {c: ['a', 'b', 'a']}
	expect(context.map(data)).toEqual({c: ['b']})
	
})

test('map set of objects', () => {
	const data = {
		items: [
			{
				key: 1,
				name: 'one'
			},
			{
				key: 2,
				name: 'two'
			}
		]
	}
	const context = new Context({
		key: 'id'
	})
	expect(context.map(data)).toEqual({
		items: [
			{
				id: 1,
				name: 'one'
			},
			{
				id: 2,
				name: 'two'
			}
		]
	})
	
})

test('deep mapping', () => {
	const context = new Context({
		a: 'b.c'
	})
	const data = {
		a: 'foo',
		bar: 'a'
	}
	const result = {
		b: {c: 'foo'},
		bar: 'b.c'
	}
	expect(context.map(data)).toEqual(result)
	
})

test('consolidate keys', () => {
	const context = new Context({
		a: 'c',
		b: 'c'
	})
	const data = {
		a: 1,
		b: 2
	}
	const result = {
		c: [1, 2]
	}
	expect(context.map(data)).toEqual(result)
	
})

test('deep mapping - advanced syntax', () => {
	const context = new Context({
		a: {
			key: 'b'
		}
	})
	// Console.log({context})
	const data = {
		a: 'foo',
		bar: 'a'
	}
	const result = {
		b: 'foo',
		bar: 'a'
	}
	expect(context.map(data)).toEqual(result)
	
})

test('hidden keys are removed', () => {
	const context = new Context({
		a: null
	})
	const data = {
		a: 'secret',
		b: 'a',
		c: ['a'],
		d: {
			a: 'secret',
			e: 'a',
			f: ['a']
		}
	}
	const expected = {
		// A: 'secret',
		b: null,
		c: [null],
		d: {
			e: null,
			// A: 'secret'
			f: [null]
		}
	}
	const result = context.map(data)
	expect(result.a).toEqual(expected.a)
	expect(result.b).toEqual(expected.b)
	expect(result.d).toEqual(expected.d)
})

test('mapKeys only maps keys', () => {
	const context = new Context({
		'orange': 'black'
	})
	expect(context.mapKeys({'orange': 'orange' })).toEqual({'black': 'orange'})
})
