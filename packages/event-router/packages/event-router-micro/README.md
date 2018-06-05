# @yodata/event-router-micro

Yodata event router with micro

## Install

```bash
git clone yodata/event-router-micro
cd event-router-micro
npm install
```

## Update Event Handlers

```js
// index.js
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
