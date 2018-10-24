const app = require('./firebase-app')
const http = require('http')

const sendSignInLinkToEmail = async (email) => {
	const options = {
		url: 'http://localhost:3000/auth/callback',
		handleCodeInApp: true
	}
	return app.auth().sendSignInLinkToEmail(email,options)
}


module.exports = function signInWithEmail(email) {
	return new Promise((resolve, reject) => {
		const server = http.createServer((req,res) => {
			console.log('url received', req.url)
			const isEmailLink = app.auth().isSignInWithEmailLink(req.url)
			console.log({isEmailLink})
			if(isEmailLink) {
				app.auth()
				.signInWithEmailLink(email,req.url)
				.then(result => {
					console.log({result})
					server.close()
					resolve('you did it!')
				})
			}
		})
		sendSignInLinkToEmail(email)
		.then(()=> {
			console.log('check your email')
			server.listen(3000)
		})
	})
}
