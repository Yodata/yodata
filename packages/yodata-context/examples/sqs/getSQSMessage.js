const axios = require('axios')
import get from 'lodash/get';

export default async function getSQSMessage(url) {
  return axios.get(`${url}?Action=ReceiveMessage`).then(res => {
    let message = get(res,[
      'data',
      'ReceiveMessageResponse',
      'ReceiveMessageResult',
      'messages',
      '0',
      'Body'
    ])
    return JSON.parse(message)
  });
}
