const store = require('../util/configstore')
const handler = require('../util/create-response-handler')

exports.command = 'config <cmd>'
exports.description = 'get | set | delete | reset\n'
exports.builder = function (cli) {
	cli.default('output', 'text')
	cli.option('from-profile', { alias: 'P', description: 'get value from profile', type: 'boolean' })
	cli.command('get <key>', 'get config[key] value', {}, handler(getValue))
	cli.command('set <key> <value>', 'set profile[key] = value', {}, handler(setValue))
	cli.command('delete <key>', 'delete config value', {}, handler(deleteValue))
	cli.command('show', 'get store state', {}, handler(store.all))
	cli.command('profile [new-profile-name]', 'get/set currentProfile', {}, handler(getSetProfile))
	return cli
}

function getValue(props) {
	const { fromProfile, key } = props
	return fromProfile ? store.getProfileValue(key) : store.get(key)
}

function setValue(props) {
	const { key, value } = props
	store.set(key, value)
	return `${key} = ${value}`
}

function deleteValue(props) {
	const { key } = props
	store.delete(key)
	return `${key} deleted`
}

function getSetProfile(props) {
	const { newProfileName } = props
	if (newProfileName) {
		store.set('profile', newProfileName)
		return `profile = ${newProfileName}`
	}

	return `profile = ${store.get('profile')}`
}

