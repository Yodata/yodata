const toObject = require('../to-object')
const Schema = require('../schema')

test('functional', done => {
	const schema = new Schema().fetch('http://schema.org/name')
	const result = toObject(schema.graph.getQuads())
	expect(result).toEqual({
		type: 'Property',
		label: 'name'
	})
})
