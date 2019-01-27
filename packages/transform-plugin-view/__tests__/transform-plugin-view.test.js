'use strict';

const plugin = require('../lib');
const transform = require('@yodata/transform')

describe('@yodata/transform-plugin-view', () => {
		test('plugin', () => {
			const data = {name: 'bob', a: {a:1, b:2, c: {d:1}}}
			const cdef = {'@view': `name`}
			const context = new transform.Context(cdef).use(plugin)
			return expect(context.map(data)).toEqual('bob')
		})
});
