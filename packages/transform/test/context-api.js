import test from 'ava'
import expect from 'expect'
import Context from '../src/context'

const context = new Context({
	a: 'A',
	b: () => 'B',
	c: {
		key: 'c',
		val: () => 'C-VALUE'
	}
})

test('has(key) - true if context maps the key or property', t => {
	expect(context.has('a')).toBeTruthy()
	expect(context.has('d')).toBeFalsy()
	t.pass()
})

test('hasKey(key) - context handles the provided key', t => {
	expect(context.hasKey('b')).toBeTruthy()
	t.pass()
})

test('hasVal(key) - context has a value handler', t => {
	expect(context.hasVal('c')).toBeTruthy()
	t.pass()
})

test('mapKey(value)', t => {
	expect(context.mapKey('a')).toEqual('A')
	t.pass()
})

test('mapKey(novalue) returns the passed value', t => {
	expect(context.mapKey('nada')).toEqual('nada')
	t.pass()
})

test('mapVal(value)', t => {
	const ctx = new Context({b: () => 'B'})
	expect(ctx.mapVal('b')).toEqual('B')
	t.pass()
})

test('empty context', t => {
	const context = new Context()
	const data = {
		a: 1
	}
	expect(context.map(data)).toEqual(data)
	t.pass()
})

test('extend context', t => {
	const a = new Context({a: 'b'})
	const b = a.extend({c: 'd'})
	expect(b).toHaveProperty('cdef', {
		a: 'b',
		c: 'd'
	})
	t.pass()
})

test('@initialValue', t => {
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
	t.pass()
})

test('by default, keys and values pass through', t => {
	const context = new Context()
	const data = {
		key: 1,
		foo: 'bar'
	}
	expect(context.map(data)).toEqual(data)
	t.pass()
})

test('maps keys', t => {
	const context = new Context({a: 'b'})
	const data = {a: 1}
	const result = {b: 1}
	expect(context.map(data)).toEqual(result)
	t.pass()
})

test('maps values', t => {
	const context = new Context({a: 'b'})
	const data = {c: 'a'}
	expect(context.map(data)).toEqual({c: 'b'})
	t.pass()
})

test('map sets', t => {
	const context = new Context({a: 'b', c: 'c'})
	const data = {c: ['a', 'b', 'a']}
	expect(context.map(data)).toEqual({c: ['b']})
	t.pass()
})

test('map set of objects', t => {
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
	t.pass()
})

test('deep mapping', t => {
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
	t.pass()
})

test('consolidate keys', t => {
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
	t.pass()
})

test('deep mapping - advanced syntax', t => {
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
	t.pass()
})

test('hidden keys are removed', t => {
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
	t.deepEqual(result.c, expected.c)
	t.pass()
})
