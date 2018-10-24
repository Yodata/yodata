'use strict'

const clc = require('cli-color')
const prompt = require('email-prompt')
const opn = require('opn')
const rp = require('request-promise')
const uuid = require('uuid')
const server = require('micro')
const Command = require('../lib/command')
const login = require('./login-github')

module.exports = new Command('login')
	.description('logs into your account or creates a new one')
	.action(options => {
		return login().then(console.log).catch(error => {
			console.error(error)
		})
	})
