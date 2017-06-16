const axios = require('axios')
const jsonata = require('jsonata')

export default async function getSQSMessage(url) {
  const messageBody = jsonata(
    'ReceiveMessageResponse.ReceiveMessageResult.messages.Body'
  );
  return axios.get(`${url}?Action=ReceiveMessage`).then(response => {
    let data = response.data;
    let body = messageBody.evaluate(data);

    return JSON.parse(body);
  });
}
