
module.exports = function (client) {
	client.inbox = {
		list: require('./list')(client)
	}
	return client
}
