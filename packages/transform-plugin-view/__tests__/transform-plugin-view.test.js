'use strict'

const {Context} = require('@yodata/transform')
const plugin = require('../lib')

const createContext = cdef => new Context(cdef).use(plugin)

describe('transform-plugin-view', () => {
	test('example.1', () => {
		const data = {
			type: 'RealEstateAgent',
			name: 'Bruce Wayne',
			contactPoint: [
				{name: 'Home', telephone: '1-890-470-8932', email: 'user@example.com'},
				{name: 'Work', telephone: '944.404.8624'}
			]
		}
		const context = createContext({
			'@view': '{ "name": name, "phone": [*.telephone] }'
		})
		expect(context.map(data)).toEqual({
			name: 'Bruce Wayne',
			phone: [
				'1-890-470-8932',
				'944.404.8624'
			]
		})
	})
})
