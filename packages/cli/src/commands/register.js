const { Command } = require('@oclif/command')
const { addProfile, hasProfile } = require('@yodata/config')
const { prompt } = require('../util')

class RegisterCommand extends Command {
  async run () {
    const hostname = await prompt('pod url', { validate: validateHostName })
    const hostkey = await prompt('pod secret (api-key)')
    const name = await prompt('profile name', { validate: validateProfileName })
    const profile = addProfile({ name, hostname, hostkey })
    this.log(`\nprofile ${profile.name} ${profile.hostname} registered.`)
  }
}

RegisterCommand.description = 'Add a new profile.'

module.exports = RegisterCommand

async function validateProfileName (input) {
  if (!input) {
    return `Profile name is required.`
  }

  if (hasProfile(input)) {
    return `The name ${input} is taken, please try another`
  }

  return true
}

async function validateHostName (hostname) {
  if (!hostname.startsWith('http')) {
    return `${hostname} is not a valid hostname (http://example.com)`
  }

  return true
}
