const { Command, flags } = require('@yodata/cli-tools')
const { Container } = require('@yodata/container-client')
const Conf = require('conf')
const path = require('path')

// @ts-ignore
class EventCommand extends Command {
  constructor (argv, config) {
    super(argv, config)
    this.store = new Conf()
  }

  get baseTopic () {
    return this.store.get('baseTopic', '/event/topic/')
  }

  get topic () {
    return this.prop.topic || this.store.get('topic')
  }

  get pathname () {
    return path.join([this.baseTopic, this.topic])
  }

  get container () {
    return new Container({ ...this.profile, pathname: this.pathname })
  }

  setTopic (name) {
    return this.store.set('topic', name)
  }

  expandTopicName (name) {
    return path.join([this.baseTopic, name])
  }

  shrinkTopicName (name) {
    return String(name).replace(this.baseTopic, '')
  }
}

exports.Command = EventCommand
exports.flags = flags
