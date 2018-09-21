#!/usr/bin/env node
const program = require('commander')

// .command('init', 'start or reconfigure project in the current directory')
// .command('namespace', 'manage namespaces').alias('ns')
// .command('type', 'manage types').alias('t')
// .comment('property', 'manage properties').alias('p')

program
    .version('0.1')
    .command('config', 'manage configuration')
    .command('user', 'users')
    .parse(process.argv)
