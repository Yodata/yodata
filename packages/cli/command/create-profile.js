const inquirer = require('inquirer')
const client = require('../lib/yodata-client')
const Command = require('../lib/command')

module.exports = new Command('create-profile')
	.description('create or update a solid profile')
	.action(options => {
		return inquirer.prompt([
			{name: 'name'},
			{name: 'email'},
			{name: 'profileURI'}
		]).then(res => {
			const profile = {
				'#me': {
					name: res.name,
					email: res.email
				}
			}
			const body = JSON.stringify(profile)
			return client.put(res.profileURI, {headers: {'Content-Type': 'application/json'}, body}).then(result => {
				console.log(result)
				return result
			})
		})
	})

