require('dotenv').config()
const { loadContext } = require('@yodata/context-sdk')

// test('{{context.name}}', () => {
// 	const context = loadContext('../{{context.name}}.cdef.yaml')
// 	const input = require('../example/input.json')
// 	const output = require('../example/output.json')
// 	const result = context.map(input)
// 	expect(result).toEqual(output)
// })
