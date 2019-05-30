const config = require('@yodata/config')

module.exports = () => {
	if (config.profileHas('pod.url')) {
		return `${config.profileGet('pod.url')}/profile/card#me`
	}
}
