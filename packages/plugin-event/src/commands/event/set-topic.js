const { Command } = require('../../event')

class SetEventTopicCommand extends Command {
  async run () {
    const topic = await this.props()
    this.print(this.setTopic(topic))
  }
}

SetEventTopicCommand.description = 'set default topic'
SetEventTopicCommand.args = [
  { name: 'topic', description: 'name of the topic' }
]

module.exports = SetEventTopicCommand
