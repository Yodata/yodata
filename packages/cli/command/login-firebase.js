const emailPrompt = require('email-prompt')
const Command = require('../lib/command')
const signInWithEmail = require('../lib/signInWithEmail')

module.exports = new Command('login-firebase')
	.description('login with firebase auth')
	.action(() => {
		return emailPrompt()
			.then(signInWithEmail)
			.then(result => {
				console.log({result})
			})
	})
