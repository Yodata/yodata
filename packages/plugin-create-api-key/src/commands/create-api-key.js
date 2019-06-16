const { Command, prompt } = require('@yodata/cli-tools')
const createKey = require('../create-key')
const ow = require('ow').default
const config = require('@yodata/config')

class CreateApiKeyCommand extends Command {
  async run () {
    const id = await input('pod name', ow.string.minLength(2))
    const name = await input('owner name', ow.string.minLength(2))
    const email = await prompt('owner email address', validateEmail)
    const awsprofile = await prompt('aws profile name')
    const saveLocal = await prompt('save config locally', { type: 'confirm' })
    const profileInfo = await createKey({ id, name, email, awsprofile })
    if (saveLocal) {
      config.addProfile(profileInfo)
      this.print('profile saved\n')
    }

    this.print(profileInfo)
  }
}
CreateApiKeyCommand.description = 'Create a new pod/api-key pair'

function validateEmail (email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (re.test(String(email).toLowerCase())) {
    return true
  } else {
    throw new Error('need a valid email address')
  }
}

function input (name, predicate) {
  return prompt(name, {
    validate: value => {
      try {
        ow(value, name, predicate)
        return true
      } catch (error) {
        return error.message
      }
    }
  })
}

module.exports = CreateApiKeyCommand
