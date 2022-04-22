
/**
 * returns true if the url is on known root pod
 * https://bhhs.hsf...
 * https://bhhs.dev...
 *
 * @param {string} url - the url to test
 * @returns {boolean}
 */
function isRootHost (url) {
  return (
    typeof url === 'string' &&
    url.startsWith('https://bhhs.')
  )
}

module.exports = isRootHost
