
/**
 *
 *
 * @param {string} value - url to test
 * @returns {boolean} true if ?? todo: wtf is this supposed to do?
 */
function isHost (value) {
  return (typeof value === 'string' &&
    value.split('.').length >= 2 &&
    value.split('.')[0].length > 0 &&
    value.split('.').slice(-1)[0].length > 0 &&
    !(value.includes('/')))
}

module.exports = isHost
