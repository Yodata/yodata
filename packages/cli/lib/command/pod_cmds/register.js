const { profile } = require('@yodata/config')

exports.command = 'register <name> <host> <secret>'
exports.desc = 'create a new pod/profile'
exports.builder = cli => {
	cli.usage('$0 <name> <host> <secret>')
	cli.usage('$0 foo https://foo.example.com abc123')
	cli.showHelp()
	return cli
}

exports.handler = async args => {
	const { name, host, secret } = args
	profile.use(name)
	profile.set('pod.url', host)
	profile.set('pod.secret', secret)
	return profile.name()
}

