const axios = require('axios')

export default async function getSQSMessage(url) {
  return axios.get(`${url}?Action=ReceiveMessage`)
    .then(res => res.data)
}
