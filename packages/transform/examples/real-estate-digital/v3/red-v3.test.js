const input = require('./input.v3')
const output = require('./output.v3')
const context = require('./red-context-v3')

describe('red-context', () => {
	const result = context.map(input)

	test('type => type', () => {
		expect(result.type).toEqual(output.type)
	})

	test('contact', () => {
		const contact = result.object
		const expected = output.object
		expect(contact).toHaveProperty('type', expected.type)
		expect(contact).toHaveProperty('honorificPrefix', expected.honorificPrefix)
		expect(contact).toHaveProperty('givenName', expected.givenName)
		expect(contact).toHaveProperty('familyName', expected.familyName)
		expect(contact).toHaveProperty('additionalName', expected.additionalName)
		expect(contact).toHaveProperty('name', expected.name)
		expect(contact).toHaveProperty('jobTitle', expected.jobTitle)
		expect(contact).toHaveProperty('worksFor', expected.worksFor)
	})

	test('address', () => {
		const address = result.object.address[0]
		const expected = output.object.address[0]
		expect(address).toEqual(expected)
	})

	test('contactPoints', () => {
		expect(result.contactPoint).toEqual(output.contactPoint)
	})

	test('comment', () => {
		expect(result.comment).toEqual(output.comment)
	})

	// test('assignments => recipient', () => {
	// 	expect(result.recipient).toEqual(expected.recipient)
	// })
})

