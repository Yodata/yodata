const {Context, keyOrder} = require('..')

const TOKEN = '@keyOrder'

test('keyOrder - extends', () => {
	const key = TOKEN
	const value = ['a', 'b', 'c']
	const a = new Context({[key]: value})
	const b = a.extend({someOtherKey: 'someOtherValue'})
	expect(a.get(key)).toEqual(value)
	expect(b.get(key)).toEqual(value)
})

test('keyOrder - sorts keys alphabetically by default', () => {
	const context = new Context().use(keyOrder)
	const data = {c: 1, a: 1, b: 1}
	expect(context.map(data)).toEqual({a: 1, b: 1, c: 1})
})

test('keyOrder - @keyOrder.value = [key...] to set a custom order', () => {
	const context = new Context({[TOKEN]: ['foo']}).use(keyOrder)
	const a = 1
	const b = 2
	const c = 3
	const d = 4
	const foo = 5
	const data = {d, b, foo, a, c}
	const result = context.map(data)
	console.log({result})
	expect(Object.keys(result)[0]).toEqual('foo')
})

