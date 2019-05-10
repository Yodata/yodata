'use strict'
const { loadData } = require('..')

describe('load-data', () => {

	test('yaml source', () => {
		return expect(loadData('../examples/context-definition.yaml'))
			.resolves
			.toHaveProperty('foo', 'bar')
	})

	test('json source', () => {
		return expect(loadData('../examples/context-definition.json'))
			.resolves
			.toHaveProperty('foo', 'bar')
	})

	test('js/javascript source', () => {
		return expect(loadData('../examples/context-definition.js'))
			.resolves
			.toHaveProperty('foo', 'bar')
	})

	test('can get a yaml file via http', () => {
		return expect(loadData('https://subscriber.dev.yodata.io/public/context/stage/testcontext.cdef.yaml'))
			.resolves
			.toHaveProperty('$schema')
	})

	test('parses a yaml context', () => {
		const cdef = 'foo: bar'
		return expect(loadData(cdef))
			.resolves
			.toHaveProperty('foo', 'bar')
	})

	test('throws an error if http file does not exist', () => {
		const context = loadData('http://example.com')
		return expect(context).rejects.toThrowError()
	})

})