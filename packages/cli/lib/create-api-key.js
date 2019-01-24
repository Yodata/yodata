const invoke = require('./invoke-lambda-function')

const functionName = 'solid-server-api-key-service'

module.exports = async ({id, profile}) => {
	const previousProfile = process.env.AWS_PROFILE
	process.env.AWS_PROFILE = profile

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

const payload = agent => ({
	type: 'CreateAction',
	object: {
		agent,
		instrument: agent
	}
})

const getAgent = ({id, profile}) => {
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

	return agent
}
