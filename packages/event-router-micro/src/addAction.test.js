// testing action handler
const AddAction = require('require-yml')('./data/addAction.example.yaml')
const handler = require('./addAction')

test('AddAction.response', async () => {
  let response = await handler(AddAction)
  expect(response).toHaveProperty('type', 'AddAction')
})
