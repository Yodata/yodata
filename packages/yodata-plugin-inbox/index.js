const listInboxItems = require('./list')
const deleteInboxItem = require('./delete')
const pageBack = require('./back')
const history = require('./history')
const pageNext = require('./next')


module.exports = function (client) {
	client.inbox = new Inbox(client)
}

class Inbox {
	constructor(client) {
		this.list = listInboxItems(client)
		this.back = pageBack(client)
		this.next = pageNext(client)
		this.history = history(client)
		// back: require('./back')(client),
		// delete: require('./delete')(client),
		// history: require('./history')(client),
		// href: require('./href')(client),
		// next: require('./next')(client),
	}
}
