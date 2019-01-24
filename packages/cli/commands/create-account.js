const inquirer = require('inquirer')
const Command = require('../lib/command')
const createAccount = require('../lib/create-account')

module.exports = new Command('create-account')
	.description('create a new account')
	.action(() => {
		return inquirer.prompt([
			{name: 'id', default: 'my-pod'},
			{name: 'name', default: 'Bob Smith'},
			{name: 'email', default: 'user@example.com'},
			{name: 'profile', default: 'solid'}
		]).then(createAccount)
	})
