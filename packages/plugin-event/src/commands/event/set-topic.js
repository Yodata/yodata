const { Command } = require('../../event-command')

class SetEventTopicCommand extends Command {
  async run () {
    this.print(this.setBaseTopic(this.prop.topic))
  }
}

SetEventTopicCommand.description = 'set default topic'
SetEventTopicCommand.args = [
  { name: 'topic', description: 'name of the topic' }
]

module.exports = SetEventTopicCommand
