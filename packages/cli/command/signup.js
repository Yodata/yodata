const inquirer = require('inquirer')
const createAccount = require('../signup')

exports.command = 'signup'
exports.description = 'create a new yodata account'
exports.handler = async props => {
	let info
	return inquirer.prompt([
		{name: 'id', default: 'my-pod'},
		{name: 'name', default: 'Bob Smith'},
		{name: 'email', default: 'user@example.com'},
		{name: 'profile', default: 'solid'}
	])
		.then(props => {
			info = Object.assign({}, props)
			return props
		})
		.then(createAccount)
		.then(res => {
			console.log({res})
		})
}

