const inquirer = require('inquirer')
const {Command} = require('commander')
const createAccount = require('../lib/create-account')

module.exports = (program) =>
program.command('account create')
{
	return inquirer.prompt([
		{name: 'id', default: 'my-pod'},
		{name: 'name', default: 'Bob Smith'},
		{name: 'email', default: 'user@example.com'},
		{name: 'profile', default: 'solid'}
	]).then(createAccount)
}
