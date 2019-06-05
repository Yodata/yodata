const AddAction = require('require-yml')('./data/addAction.example.yaml')
const handler = require('./addAction')

test('AddAction.response', async () => {
	const response = await handler(AddAction)
	return expect(response).toHaveProperty('type', 'AddAction')
})
