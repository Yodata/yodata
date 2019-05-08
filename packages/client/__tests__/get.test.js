'use strict';
const { get } = require('..')

test('get', async () => {
	const target = '/inbox/'
	const response = await get(target)
	return expect(response).toHaveProperty('contains')
})

test('get.yaml', async () => {
	const target = 'https://dave.dev.yodata.io/public/context/stage/my-context.cdef.yaml'
	const response = await get(target)
	return expect(response).toHaveProperty('$schema', 'https://realestate.yodata.me/context/v1/schema.yaml')
})

