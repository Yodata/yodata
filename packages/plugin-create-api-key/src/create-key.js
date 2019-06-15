const invoke = require('./invoke-lambda-function')
const functionName = 'solid-server-api-key-service'

/** Create an api-key */
module.exports = async function (props) {
  const { id, awsprofile } = props
  const previousProfile = process.env.AWS_PROFILE
  process.env.AWS_PROFILE = awsprofile
  let key
  const agent = getAgent({ id, awsprofile })
  await invoke(functionName, payload(agent))
    .then(res => {
      key = res.key
    }).catch(error => {
      console.error(error)
    })
  process.env.AWS_PROFILE = previousProfile
  return {
    name: id,
    hostname: new URL(agent).origin,
    hostkey: key
  }
}

/**
 *
 *
 * @param {*} agent
 */
const payload = agent => ({
  type: 'CreateAction',
  object: {
    agent,
    instrument: agent
  }
})

/**
 *
 *
 * @param {object} props
 * @param {string} props.id
 * @param {*} props.awsprofile
 * @returns
 */
function getAgent ({ id, awsprofile }) {
  let agent
  switch (awsprofile) {
    case 'solid':
      agent = `https://${id}.dev.yodata.io/profile/card#me`
      break
    case 'rl':
      agent = `https://${id}.rl.hsfaffiliates.com/profile/card#me`
      break
    case 'hsf':
    case 'bhhs':
      agent = `https://${id}.bhhs.hsfaffiliates.com/profile/card#me`
      break
    default:
      agent = id
      break
  }

  /** @type {string} */
  return agent
}
