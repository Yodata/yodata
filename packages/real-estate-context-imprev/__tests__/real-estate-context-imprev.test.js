'use strict'

const context = require('../lib/real-estate-context-imprev')

describe('@yodata/real-estate-context-imprev', () => {
	it('better work', () => {
		const source = require('../example/real-estate-agent.yaml')
		const dest = require('../example/external-user.yaml')
		expect(context.map(source)).toEqual(dest)
	})
})
