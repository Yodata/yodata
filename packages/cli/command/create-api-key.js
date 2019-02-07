const inquirer = require('inquirer')
const createKey = require('../lib/create-api-key')

exports.command = 'create-api-key'
exports.desc = 'create a new api key'
exports.handler = async function() {
	return inquirer.prompt([
		{name: 'id', default: 'my-pod'},
		{name: 'name', default: 'Bob Smith'},
		{name: 'email', default: 'user@example.com'},
		{name: 'profile', default: 'solid'}
	])
	.then(createKey)
	.then(console.log).catch(console.error)
}
