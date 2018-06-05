# @yodata/event-router

## Useage

```javascript
// /index.js
const router = require("@yodata/event-router");

router.registerRoute({ type: "RegisterAction" }, async event => {
  const contact = event.agent.email;
  const target = event.object.id;
  console.log(`${contact} registered to recieve updates from ${target}`);
});

module.exports = router.next;
```

## Testing

```bash
npm run dev
```
