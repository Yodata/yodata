'use strict'
const { getContext } = require('..')

describe('get-context', () => {
	test('yaml source', () => {
		const context = getContext('../examples/context-definition.yaml')
		return expect(context).resolves.toHaveProperty('cdef')
	})

	test('json source', () => {
		const context = getContext('../examples/context-definition.json')
		return expect(context).resolves.toHaveProperty('cdef')
	})

	test('js/javascript source', () => {
		const context = getContext('../examples/context-definition.js')
		return expect(context).resolves.toHaveProperty('cdef')
	})

	test('can get a yaml file via http', () => {
		const context = getContext('https://subscriber.dev.yodata.io/public/context/stage/testcontext.cdef.yaml')
		return expect(context).resolves.toHaveProperty('cdef')
	})

	test('parses a yaml context', () => {
		const cdef = 'foo: bar'
		return expect(getContext(cdef)).resolves.toHaveProperty('cdef')
	})

	test('parses a json file', () => {
		const cdef = JSON.stringify({ foo: 'bar' })
		return expect(getContext(cdef)).resolves.toHaveProperty('cdef')
	})

	test('parses an object', () => {
		const cdef = { foo: 'bar' }
		return expect(getContext(cdef)).resolves.toHaveProperty('cdef')
	})

	test('throws an error if http file does not exist', () => {
		return expect(getContext('http://example.com')).rejects.toThrowError()
	})
})
