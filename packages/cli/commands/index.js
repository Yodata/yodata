module.exports = function (client) {
	const loadCommand = function (name) {
		const cmd = require('./' + name)
		cmd.register(client)
		return cmd.runner()
	}

	client.login = loadCommand('login')
	client.loginFirebase = loadCommand('login-firebase')
}
