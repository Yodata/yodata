module.exports = handleErrorResponse

function handleErrorResponse(response) {
	console.error(response)
	const { statusCode, statusMessage, body } = response
	const result = { statusCode, statusMessage }
	const error = body || statusMessage
	result.error = error.message
	return result
}
