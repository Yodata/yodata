const { getData } = require('../request')

module.exports = podRequest

async function podRequest(props) {
	switch (typeof props) {
		case 'string': {
			const target = props
			return getData(target)
		}

		case 'object': {
			const { target, select, defaultValue } = props
			return getData(target, select, defaultValue)
		}

		default:
			throw new TypeError('expected pod.get input as string or object')
	}
}
