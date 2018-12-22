const request = require('./request-rdf')
const id = 'https://schema.org/Thing'

test('returns a promise', () => {
  return expect(request(id)).toBeInstanceOf(Promise)
})

test('resolves to an array of quads', async () => {
  return expect(request(id)).resolves.toBeInstanceOf(Array)
})