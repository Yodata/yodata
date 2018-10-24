'use strict'

const fs = require('fs')

module.exports = {
	fileExistsSync(path) {
		try {
			const stats = fs.statSync(path)
			return stats.isFile()
		} catch (e) {
			return false
		}
	},
	dirExistsSync(path) {
		try {
			const stats = fs.statSync(path)
			return stats.isDirectory()
		} catch (e) {
			return false
		}
	}
}
