module.exports = function (client) {
	const loadCommand = function (name) {
		const cmd = require('./' + name)
		cmd.register(client)
		return cmd.runner()
	}

	client.createApiKey = loadCommand('create-api-key')
	client.createProfile = loadCommand('create-profile')
	client.createAccount = loadCommand('create-account')
}
