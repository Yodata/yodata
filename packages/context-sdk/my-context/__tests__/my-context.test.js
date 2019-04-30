require('dotenv').config()
const { loadContext } = require('@yodata/context-sdk')

test('my-context', () => {
	const context = loadContext('../my-context.cdef.yaml')
	const input = require('../example/input.js')
	const output = require('../example/output.js')
	const result = context.map(input)
	expect(result).toEqual(output)
})
