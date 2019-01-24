// @ts-check
const {Lambda} = require('aws-sdk')
const stringify = require('fast-safe-stringify').default

const defaultLambdaConfig = {
	region: 'us-west-2'
}

/**
 * Normalizes a lambda invocation to work like a regular async call
 * @param {string} FunctionName
 * @param {object} event - lambda Payload
 * @param {object} [lambdaConfig] - Aws.Lambda.InvokeParams
 * @returns {Promise<object>} returns the InvokeResponse.Payload
 */
const invokeLambdaFunction = async (FunctionName, event, lambdaConfig) => {
	const config = Object.assign(defaultLambdaConfig, lambdaConfig)
	const lambda = new Lambda(config)
	const Payload = stringify(event)
	const lambdaResponse = await lambda.invoke({FunctionName, Payload}).promise()
	if (functionError(lambdaResponse)) {
		const message = lambdaResponse.Payload.toString()
		const error = new Error(message)
		error.name = `INVOKE_ERROR:${FunctionName}`
		throw error
	} else {
		const payload = lambdaResponse.Payload.toString()
		return JSON.parse(payload)
	}
}

const functionError = response => {
	return (typeof response.FunctionError !== 'undefined')
}

module.exports = invokeLambdaFunction
