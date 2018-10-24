import test from 'ava'
import expect from 'expect'
import {Context, parseContext} from '..'
import {KEYMAP, VALMAP} from '../src/constants'

test('simple syntax a = b => replace a with b in keys and values', t => {
	const context = new Context({a: 'b'})
	expect(context[KEYMAP]).toHaveProperty('a', 'b')
	expect(context.mapKey('a')).toEqual('b')
	expect(context.map({a: 1})).toEqual({b: 1})
	expect(context.map({b: 'a'})).toEqual({b: 'b'})
	t.pass()
})

test('function syntax a = (fn, deps) => dest.a = 1', t => {
	const context = parseContext({
		key: 'key',
		nextKey: ({last}) => last.key + 1
	})
	expect(context[KEYMAP]).toHaveProperty('nextKey', 'nextKey')
	expect(context[VALMAP]).toHaveProperty('nextKey')
	t.pass()
})

test('advanced syntax', t => {
	const context = parseContext({
		a: {
			key: 'b',
			val: () => 'c'
		}
	})
	expect(context[KEYMAP]).toHaveProperty('a', 'b')
	expect(context[VALMAP]).toHaveProperty('a')
	t.pass()
})

test('sub-context - advanced syntax', t => {
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
	t.pass()
})

test('malformed context error', t => {
	expect(() => parseContext({1: 2})).toThrow('parseContext error')
	t.pass()
})
