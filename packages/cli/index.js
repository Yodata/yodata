'use strict'

var program = require('commander')
var pkg = require('./package.json')
var clc = require('cli-color')
var logger = require('./lib/logger')
var didYouMean = require('didyoumean')

program.version(pkg.version)
program.option(
    '-N, --namespace <namespace>',
    'the namespace to use for this command'
)

var client = {}
client.cli = program
client.logger = require('./lib/logger')
client.errorOut = function(error, status) {
    require('./lib/errorOut')(client, error, status)
}
client.getCommand = function(name) {
    for (var i = 0; i < client.cli.commands.length; i++) {
        if (client.cli.commands[i]._name === name) {
            return client.cli.commands[i]
        }
    }
    return null
}

require('./commands')(client)

var commandNames = program.commands.map(function(cmd) {
    return cmd._name
})

var RENAMED_COMMANDS = {
    'delete-site': 'hosting:disable',
    'disable:hosting': 'hosting:disable',
    'data:get': 'database:get',
    'data:push': 'database:push',
    'data:remove': 'database:remove',
    'data:set': 'database:set',
    'data:update': 'database:update',
    'deploy:hosting': 'deploy --only hosting',
    'deploy:database': 'deploy --only database',
    'prefs:token': 'login:ci',
}

program.action(function(cmd, cmd2) {
    logger.error(clc.bold.red('Error:'), clc.bold(cmd), 'is not a yodata command')

    if (RENAMED_COMMANDS[cmd]) {
        logger.error()
        logger.error(
            clc.bold(cmd) + ' has been renamed, please run',
            clc.bold('firebase ' + RENAMED_COMMANDS[cmd]),
            'instead'
        )
    } else {
        var suggestion = didYouMean(cmd, commandNames)
        suggestion = suggestion || didYouMean([cmd, cmd2].join(':'), commandNames)
        if (suggestion) {
            logger.error()
            logger.error('Did you mean', clc.bold(suggestion) + '?')
        }
    }

    process.exit(1)
})

module.exports = client
