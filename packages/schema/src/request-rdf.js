const {Parser} = require('n3')
const got = require('got')
const logger = require('./logger')

const client = got.extend({
	headers: {
		accept: 'application/x-turtle,application/rdf+n3;q=0.9,application/ld+json;q=0.8,text/turtle;q=0.7'
	}
})
const parser = Parser()

module.exports = async function request(uri) {
	return client.get(uri)
		.then(response => {
			return parser.parse(response.body)
		})
}
