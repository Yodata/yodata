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
