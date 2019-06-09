const { Command } = require('@oclif/command')
const { addProfile, Profile } = require('@yodata/config')
const { cli } = require('cli-ux')

class RegisterCommand extends Command {
  async run () {
    const hostname = await cli.prompt('what is your pod url')
    const hostkey = await cli.prompt('pod secret (api-key)')
    const name = await cli.prompt('profile name')
    const profile = addProfile({ name, hostname, hostkey })
    this.log(`profile ${name} - ${hostname} added.`)
  }
}

RegisterCommand.description = 'Add a new profile.'

module.exports = RegisterCommand
