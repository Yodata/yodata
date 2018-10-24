'use strict'

const cjson = require('cjson')
const FirebaseError = require('./error')

module.exports = function (path) {
	try {
		return cjson.load(path)
	} catch (error) {
		if (error.code === 'ENOENT') {
			throw new FirebaseError('File ' + path + ' does not exist', {exit: 1})
		}
		throw new FirebaseError('Parse Error in ' + path + ':\n\n' + error.message)
	}
}
