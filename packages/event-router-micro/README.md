# @yodata/event-router-micro

Scaffold event handler service using [Zeit Micro](https://github.com/zeit/micro)

## Getting started

### Installation

```bash
> npx degit yodata/event-router-micro my-service
> cd my-service
> npm install
```

## Event Handler Functions

```js
// src/addAction.js
const EventRouter = require("@yodata/event-router");
const router = new EventRouter();

router.registerRoute({ type: "AskAction" }, async function(event) {
  console.log("someone asked a question");
  return event;
});

router.registerRoute({ type: "RegisterAction" }, async function(event) {
  console.log("someone registered for updates from a website");
  return event;
});

module.exports = req => router.nextHttp(req);
```

## Start Service (development)

```bash
npm run dev
```

## Testing the service locally

Option 1: Postman https://www.getpostman.com/

Option 2: (MacOS)

```bash
brew install httpie
## when service is running
http :3000 type=AskAction
```
