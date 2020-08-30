const invoke = require('./invoke-lambda-function')
const functionName = 'solid-server-api-key-service'

/**
 * create an api-key
 * @param {object} props - parameters
 * @param {string} props.id - pod sub-domain id
 * @param {string} props.awsprofile - aws profile name
 */
module.exports = async function (props) {
  const { id, awsprofile } = props
  const previousProfile = process.env.AWS_PROFILE
  process.env.AWS_PROFILE = awsprofile
  let key
  const host = getAgent({ id, awsprofile })
  await invoke(functionName, payload(host))
    .then(res => {
      key = res.key
    })
    .catch(error => {
      console.error(error)
    })
    .finally(() => {
      process.env.AWS_PROFILE = previousProfile
    })

  return {
    hostname: new URL(host).origin,
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
function getAgent({ id, awsprofile }) {
  let agent
  if (id.startsWith('http://')) {
    return  id
  }
  switch (awsprofile) {
    case 'solid':
      agent = `https://${id}.dev.yodata.io/profile/card#me`
      break
    case 'solid-dev':
      agent = `https://${id}.bhhs.dev.yodata.io/profile/card#me`
      break
    case 'rl':
      agent = `https://${id}.rl.hsfaffiliates.com/profile/card#me`
      break
    case 'hsf':
    case 'bhhs':
      agent = `https://${id}.bhhs.hsfaffiliates.com/profile/card#me`
      break
    case 'bhcre':
      agent = `https://${id}.reflex.bhcre.com/profile/card#me`
      break
    default:
      agent = id
      break
  }

  /** @type {string} */
  return agent
}
