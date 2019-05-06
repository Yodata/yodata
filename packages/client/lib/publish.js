const createClient = require('./create-client')

module.exports = publish

/**
 *
 *
 * @param {string} recipient - @example https://bob.example.com/profile/card#me
 * @param {string} topic - @example realestate/contact#add
 * @param {object} data - json message
 * @returns {Promise}
 */
async function publish(recipient, topic, data) {
	return createClient().post('/publish', {
		json: true,
		body: { recipient, topic, data }
	})
}
