
const conf = configStore(defaults)

module.exports = {
	root: conf('ROOT')
}

const server = solid.createServer({
	root: ROOT,
	port: PORT,
	serverUri: HOST,
	webid: true,
	configPath: '/etc/solid-server',
	dbPath: '/data/solid-server/db',
	sslKey: '/etc/ssl/certs/yodata.dave.key.pem',
	sslCert: '/etc/ssl/certs/yodata.dave.cert.pem',
	multiuser: true,
	email: {
		host: 'email-smtp.us-west-2.amazonaws.com',
		port: '465',
		secure: true,
		auth: {
			user: 'AKIAIW7FFSQZZT2UBNXA',
			pass: 'AscutiApkebQ60z3Ay1JPQ2QPP8DUiAJT+H1o1OtnTCr'
		}
	},
	verbose: true
})
