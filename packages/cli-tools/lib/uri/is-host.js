
/**
 * return true if the string looks like a hostname
 * i.e user.example.com
 *
 * @param {string} value - the string to test
 * @returns {boolean}
 */
function isHost (value) {
  return (typeof value === 'string' &&
    value.split('.').length >= 2 &&
    value.split('.')[0].length > 0 &&
    value.split('.').slice(-1)[0].length > 0 &&
    !(value.includes('/')))
}

module.exports = isHost
