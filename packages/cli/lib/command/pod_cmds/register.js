const { profile } = require('@yodata/config')

exports.command = 'register <name> <host> <secret>'
exports.desc = 'adds a new pod to cachec / local datastore'
exports.handler = args => {
	const { name, host, secret } = args
	profile.use(name)
	profile.set('pod.url', host)
	profile.set('pod.secret', secret)
	return profile.name()
}

