const inquirer = require('inquirer')
const createClient = require('../lib/yodata-client')

exports.command = 'create-profile'
exports.description = 'create or update a solid profile'
exports.handler = (props) => {
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
		const client = createClient()
		return client
			.put(res.profileURI, {headers: {'Content-Type': 'application/json'}, body})
			.then(result => {
				console.log(result)
				return result
			})
	})
}

