const Configstore = require('configstore')

const { YODATA_POD_URL, YODATA_POD_SECRET, YODATA_PROFILE } = process.env
const store = new Configstore('@yodata/context-sdk', {
	profile: YODATA_PROFILE || 'default',
	default: {
		podurl: YODATA_POD_URL,
		secret: YODATA_POD_SECRET
	}
})

module.exports = store
