'use strict'

const {Context, keyOrder, defaultValues} = require('@yodata/transform')
const plugin = require('../lib')

const createContext = cdef => new Context(cdef).use(keyOrder).use(defaultValues).use(plugin)

describe('transform-plugin-view', () => {
	const data = {
		'@context': 'http://schema.org',
		type: 'AskAction',
		instrument: 'http://example.com',
		agent: {
			'@type': 'Person',
			name: 'Bob',
			email: 'user@example.com'
		},
		recipient: {
			'@type': 'RealEstateAgent',
			'@id': 'https://465156.ds.bhhsresource.com/profile/card#me',
			name: 'Bruce Wayne',
			contactPoint: [
				{name: 'Home', telephone: '1-890-470-8932', email: 'user@example.com'},
				{name: 'Work', telephone: '944.404.8624'}
			]
		}
	}
	test('select property name', () => {
		const context = createContext({'@view': {instrument: 'instrument'}})
		expect(context.map(data)).toEqual({instrument: 'http://example.com'})
	})
	test('select @property', () => {
		const context = createContext({'@view': {'@context': '$."@context"'}})
		expect(context.map(data)).toEqual({'@context': 'http://schema.org'})
	})
	test('nested view', () => {
		const context = createContext({'@view': '{"lead": {"type": type}}'})
		expect(context.map(data)).toEqual({lead: {type: 'AskAction'}})
	})
	test('nested object view', () => {
		const context = createContext({'@view': {lead: {type: 'type'}}})
		expect(context.map(data)).toEqual({lead: {type: 'AskAction'}})
	})
})
