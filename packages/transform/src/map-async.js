module.exports = (context) => async function mapAsync(data, initialValue) {
	const result = await context.map(data, initialValue)
	return result
}
