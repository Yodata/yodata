const firebase = require('firebase')
require('firebase/firestore')

const prodConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'api-yodata-io.firebaseapp.com',
  databaseURL: 'https://api-yodata-io.firebaseio.com',
  projectId: 'api-yodata-io',
  storageBucket: 'api-yodata-io.appspot.com',
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
}

const devConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'api-yodata-io.firebaseapp.com',
  databaseURL: 'https://api-yodata-io.firebaseio.com',
  projectId: 'api-yodata-io',
  storageBucket: 'api-yodata-io.appspot.com',
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
}

const config = process.env.NODE_ENV === 'production'
  ? prodConfig
  : devConfig

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

const db = firebase.firestore()
const auth = firebase.auth()

export {
  db,
  auth,
}
