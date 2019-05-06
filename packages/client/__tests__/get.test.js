'use strict';
const { get } = require('..')

test('get', async () => {
	const target = '/inbox/'
	const response = await get(target)
	expect(response).toHaveProperty('data.contains')
})

test('get.yaml', async () => {
	const target = 'https://dave.dev.yodata.io/public/context/stage/my-context.cdef.yaml'
	const response = await get(target)
	expect(response).toHaveProperty('data.$schema', 'https://realestate.yodata.me/context/v1/schema.yaml')
})

