#!/usr/bin/env node
const program = require('commander')
const Configstore = require('configstore')

const config = new Configstore('@yodata/cli')

// .command('init', 'start or reconfigure project in the current directory')
// .command('namespace', 'manage namespaces').alias('ns')
// .command('type', 'manage types').alias('t')
// .comment('property', 'manage properties').alias('p')

program
	.command('show')
	.description('show all settings')
	.action(() => {
		console.dir(config.all)
	})

program.command('set').action((name, val) => {
	config.set(name, val)
	console.log(config.get(name))
})

program.parse(process.argv)
