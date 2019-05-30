const EventRouter = require('@yodata/event-router')

const router = new EventRouter()

const handleAddAction = require('./src/addAction')

router.registerRoute({type: 'AddAction'}, handleAddAction)

module.exports = httpRequest => router.nextHttp(httpRequest)
