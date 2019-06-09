const { Command } = require('@oclif/command')
const config = require('@yodata/config')

class WhoamiCommand extends Command {
	async run() {
		const profile = config.currentProfile()
		this.log(`${profile.name} - ${profile.hostname}`)
	}
}

WhoamiCommand.description = 'Get the current profile name'
module.exports = WhoamiCommand
