'use strict';

const plugin = require('..');
const transform = require('@yodata/transform')

describe('@yodata/transform-plugin-view', () => {
		test('plugin', () => {
			const data = {name: 'bob'}
			const cdef = {'@view': `name`}
			const context = new transform.Context(cdef).use(plugin)
			return expect(context.map(data)).toEqual('bob')
		})
});
