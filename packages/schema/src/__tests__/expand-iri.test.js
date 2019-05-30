const expandIRI = require('../expand-iri')

test('works', () => {
	expect(expandIRI()('schema')).resolves.toEqual('http://schema.org/')
})
