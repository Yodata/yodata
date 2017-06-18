import get from 'lodash/get'

/**
 * creates a deep getter with an optional default value
 * @param {string} path - the path to retrieve from the subject i.e. 'path.to.value'
 * @param {*} [defaultValue] - value to return if nothing is found at subject[path]
 */
const getIn = (path, defaultValue) => data => get(data, path, defaultValue)

export default getIn
