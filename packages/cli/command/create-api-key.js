const inquirer = require('inquirer')
const Command = require('../lib/command')
const createKey = require('../lib/create-api-key')

module.exports = new Command('create-api-key')
	.description('create a new account')
	.action(() => {
		return inquirer.prompt([
			{name: 'id', default: 'my-pod'},
			{name: 'name', default: 'Bob Smith'},
			{name: 'email', default: 'user@example.com'},
			{name: 'profile', default: 'solid'}
		]).then(createKey).then(console.log).catch(console.error)
	})
