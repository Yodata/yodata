require('dotenv').config()
const { loadContext } = require('@yodata/context-sdk')

test('', () => {
	const context = loadContext('../.cdef.yaml')
	const input = require('../example/input.json')
	const output = require('../example/output.json')
	const result = context.map(input)
	expect(result).toEqual(output)
})
