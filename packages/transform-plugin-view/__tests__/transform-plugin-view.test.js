'use strict'

const {Context} = require('@yodata/transform')
const plugin = require('../lib')

const createContext = cdef => new Context(cdef)

describe('@yodata/transform-plugin-view', () => {
	test('view.object', () => {
		const data = {
			type: 'Person',
			fullName: 'Bob Smith'
		}
		const context = createContext({
			Person: 'RealEstateAgent',
			'@view': {
				type: 'type',
				name: 'fullName'
			}
		}).use(plugin)
		const result = context.map(data)
		console.log({result})
		expect(result).toHaveProperty('type', 'RealEstateAgent')
		expect(result).toHaveProperty('name', 'Bob Smith')
	})
})
