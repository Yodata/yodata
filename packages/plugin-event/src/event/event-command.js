const { Command } = require('@yodata/cli-tools')
const Conf = require('@yodata/config')
const path = require('path')

// @ts-ignore
class EventCommand extends Command {
  constructor (argv, config) {
    super(argv, config)
    this.store = new Conf({ projectName: '@yodata/event' })
  }

  get topic () {
    return this.store.get('topic')
  }

  setTopic (name) {
    return this.store.set('topic', name)
  }

  get pathname () {
    return path.join('/event/topic/', this.topic)
  }

  topicToPath (name) {
    return path.join('/event/topic/', name)
  }

  pathToTopic (name) {
    return String(name).replace('/event/topic/', '')
  }
}

module.exports = EventCommand
