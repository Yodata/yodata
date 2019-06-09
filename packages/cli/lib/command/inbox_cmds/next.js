'use strict'

const { inbox } = require('@yodata/client')
const { sort, print } = require('../../util')

exports.command = 'next'
exports.description = 'get next inbox page'
exports.builder = {
  output: {
    default: 'table'
  },
  orderBy: {
    desc: 'sort column',
    default: ['time']
  }
}
exports.handler = props => {
  inbox.next()
    .then(sort(props.orderBy))
    .then(items => {
      return items.map(message => ({
        index: message.index,
        time: message.timestamp ? new Date(message.timestamp).toISOString() : '',
        topic: message.topic,
        id: message.id ? message.id.split('/inbox/')[1] : ''
      }))
    })
    .then(print.result(props))
}
