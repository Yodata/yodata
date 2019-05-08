const parse = require('../lib/parse-response-data')
const jsondata = JSON.stringify({ type: 'jsondata' })
const yamldata = `type: yamldata`

const createResponse = (contentType, body) => ({
	headers: {
		'content-type': contentType
	},
	body
})


test('parse.response.json', () => {
	const response = createResponse('application/json', jsondata)
	return expect(parse(response)).resolves.toHaveProperty('data', { type: 'jsondata' })
})

test('parse.response.yaml', () => {
	const response = createResponse('application/x-yaml', yamldata)
	return expect(parse(response)).resolves.toHaveProperty('data', { type: 'yamldata' })
})
