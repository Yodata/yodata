# @yodata/event-router-micro

Scaffold event handler service using [Zeit Micro](https://github.com/zeit/micro)

## Installation

```bash
> npx degit yodata/event-router-micro my-service
> cd my-service
> npm install
```

## Event handlers

```javascript
// ./src/addAction.js
/**
 * @function handleAddAction
 * @param {object} action
 * @returns {promise}
 * @description
 * Your handler can require any npm package - just add it to your package.json
 * Async function - should always return some value to ensure the promise is resolved properly
 */
module.exports = async function handleAddAction (action) {
  // add your handler code here
  // always return some response or throw an error
  return action
}
```

## Testing handlers

```javascript
// ./src/addAction.test.js
const AddAction = require('require-yml')('./data/addAction.example.yaml')
const handler = require('./addAction')

test('AddAction.response', async () => {
  let response = await handler(AddAction)
  expect(response).toHaveProperty('type', 'AddAction')
})
```

## Run service locally

```bash
> npm run dev
```

## Testing the service locally

Option 1: Postman https://www.getpostman.com/

Option 2: [HTTPPie](https://httpie.org/doc#installation) (recommended)

```bash
# when service is running on localhost:3000
http :3000 < src/data/addAction.example.json
```

## Service hosting recommendations

[Zeit/now](https://zeit.co/now)
