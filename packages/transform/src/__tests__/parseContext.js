const Context = require('../context')
const parseContext = require('../parseContext')
const {KEYMAP, VALMAP} = require('../constants')

test('simple syntax a = b => replace a with b in keys and values', () => {
	const context = new Context({a: 'b'})
	expect(context[KEYMAP]).toHaveProperty('a', 'b')
	expect(context.mapKey('a')).toEqual('b')
	expect(context.map({a: 1})).toEqual({b: 1})
	expect(context.map({b: 'a'})).toEqual({b: 'b'})
	
})

test('function syntax a = (fn, deps) => dest.a = 1', () => {
	const context = parseContext({
		key: 'key',
		nextKey: ({last}) => last.key + 1
	})
	expect(context[KEYMAP]).toHaveProperty('nextKey', 'nextKey')
	expect(context[VALMAP]).toHaveProperty('nextKey')
	
})

test('advanced syntax', () => {
	const context = parseContext({
		a: {
			key: 'b',
			val: () => 'c'
		}
	})
	expect(context[KEYMAP]).toHaveProperty('a', 'b')
	expect(context[VALMAP]).toHaveProperty('a')
	
})

test('sub-context - advanced syntax', () => {
	const context = parseContext({
		a: {
			key: 'b',
			context: {
				d: 'e'
			}
		}
	})
	expect(context[KEYMAP]).toHaveProperty('a', 'b')
	expect(context[KEYMAP]).toHaveProperty('d')
	expect(context[VALMAP]).toHaveProperty('a')
	
})

test('malformed context error', () => {
	expect(() => parseContext({1: 2})).toThrow('parseContext error')
})
