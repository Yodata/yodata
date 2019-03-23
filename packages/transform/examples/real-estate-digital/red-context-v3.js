const cdef = require('./cdef')
const { Context } = require('../../lib')

const context = new Context(cdef)
context.use(redPlugin)
function redPlugin(event, object) {
	if (event === 'MAP_RESULT') {
		return mapContactPoints(object)
	}

	return object
}

const mapContactPoints = last => {
	const contact = { ...last.contact }
	if (
		contact &&
		contact.contactPoint &&
		Array.isArray(contact.contactPoint)
	) {
		const contactPoint = []
		const homeLocation = contact.homeLocation || []
		const workLocation = contact.workLocation || []
		last.contact.contactPoint.forEach(point => {
			if (point) {
				switch (point.name) {
					case 'Home':
						homeLocation.push(point)
						break
					case 'Work':
						workLocation.push(point)
						break
					default:
						contactPoint.push(point)
				}
			}
		})
		Object.assign(last.contact, { homeLocation, workLocation, contactPoint })
	}

	return last
}

module.exports = context
