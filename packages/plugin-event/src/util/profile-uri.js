const { URL } = require('url')

/**
 * takes a url and returns {url}/profile/card#me
 * for sanity
 *
 * @param {string} - url to use as the base
 * @returns {string<url>}
 */
function profileURI (url) {
  if (typeof url === 'string') {
    if (url.startsWith('http')) {
      return new URL(url).origin + '/profile/card#me'
    }
  }
  throw new Error('invalid_url')
}

module.exports = profileURI
