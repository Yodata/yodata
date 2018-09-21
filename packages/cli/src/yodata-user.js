#!/usr/bin/env node

const program = require('commander')
const client = require('./db')

const Configstore = require('configstore')
const config = new Configstore('@yodata/cli')

// .command('init', 'start or reconfigure project in the current directory')
// .command('namespace', 'manage namespaces').alias('ns')
// .command('type', 'manage types').alias('t')
// .comment('property', 'manage properties').alias('p')

program
    .command('list')
    .description('show all users')
    .action(async () => {
        console.log({client})
    })

program.parse(process.argv)
