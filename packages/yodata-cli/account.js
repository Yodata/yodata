#!/usr/bin/env node

require('yargs')
  .usage('$0 <cmd> [args]')
  .command(
    'account [subcommand]',
    yargs => {
      yargs.positional('name', {
        type: 'string',
        default: 'Cambi',
        describe: 'the name to say hello to'
      })
    },
    function(argv) {
      console.log('hello', argv.name, 'welcome to yargs!')
    }
  )
  .command('config view', 'show your configuration', yargs => {})
  .help().argv
