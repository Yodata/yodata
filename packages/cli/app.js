const firebase = require('firebase')

const config = {
	apiKey: 'AIzaSyCGWcm7nsHve0at0QyIDG9EjXyFdS-xzdo',
	authDomain: 'yodata-me.firebaseapp.com',
	databaseURL: 'https://yodata-me.firebaseio.com',
	projectId: 'yodata-me',
	storageBucket: 'yodata-me.appspot.com',
	messagingSenderId: '108123479880'
}

const app = firebase.initializeApp(config)

module.exports = app
