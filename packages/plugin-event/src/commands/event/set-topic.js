const { Command } = require('../../event')

class SetEventTopicCommand extends Command {
  async run () {
    const topic = String(this.prop.topic)
    this.print(this.setTopic(topic))
  }
}

SetEventTopicCommand.description = 'set default topic'
SetEventTopicCommand.args = [
  { name: 'topic', description: 'name of the topic' }
]

module.exports = SetEventTopicCommand
