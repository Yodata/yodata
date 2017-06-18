import Context from '../../src/context'
import { flow, getIn } from '../../src/helpers'

/**
 * takes a single message from an SQS queue api GET
 * @type {Context}
 * @returns {Object} - JSON parsed message body
 */
const sqsMessageBody = new Context({
  ReceiveMessageResponse: {
    key: 'Message',
    val: flow([
      getIn('value.ReceiveMessageResult.messages.0.Body'),
      JSON.parse,
      getIn('Message'),
      JSON.parse,
    ]),
  },
})

export default sqsMessageBody
