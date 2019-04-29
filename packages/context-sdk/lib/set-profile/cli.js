#!/usr/bin/env node
const setProfile = require('./set-profile')

setProfile()
	.then(console.log)
	.catch(console.error)
