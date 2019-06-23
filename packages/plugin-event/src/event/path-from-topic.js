'use strict'

module.exports = pathFromTopic

function pathFromTopic (topic) {
  const container = topic.split('#')[0]
  return `/event/topic/${container}/`
}
