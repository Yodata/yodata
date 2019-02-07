const invoke = require('./invoke-lambda-function')
const logger = require('./logger')

const functionName = 'solid-server-api-key-service'
/** Create an api-key */
module.exports = async function (props) {
	const {id, profile} = props
	logger.debug('create-api-key', {props})
	const previousProfile = process.env.AWS_PROFILE
	logger.debug('create-api-key:previousProfile', {previousProfile})
	process.env.AWS_PROFILE = profile
	logger.debug('create-api-key:AWS_PROFILE', {AWS_PROFILE: process.env.AWS_PROFILE})


	let key
	const agent = getAgent({id, profile})

	await invoke(functionName, payload(agent))
		.then(res => {
			key = res.key
		}).catch(error => {
			console.error(error)
		})
	process.env.AWS_PROFILE = previousProfile
	return {
		agent,
		key
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
 * @param {*} props.profile
 * @returns
 */
function getAgent({id, profile}) {
	let agent
	switch (profile) {
		case 'solid':
			agent = `https://${id}.dev.yodata.io/profile/card#me`
			break
		case 'rl':
			agent = `https://${id}.rl.hsfaffiliates.com/profile/card#me`
			break
		case 'hsf':
			agent = `https://${id}.bhhs.hsfaffiliates.com/profile/card#me`
			break
		default:
			agent = id
			break
	}

	/** @type {string} */
	return agent
}
