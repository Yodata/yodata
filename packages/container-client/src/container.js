/** @format */

const Client = require('@yodata/client')
const sort = require('./sort-container-items')
const Store = require('./json-store')
// eslint-disable-next-line node/no-deprecated-api
const { URL } = require('url')
const { uri } = require('@yodata/cli-tools')

/**
 * Yodata(Solid) client with list() and next() commands
 *
 * @class ContainerClient
 * @extends {Client}
 */
class ContainerClient extends Client {
  /**
   * Returns a new ContainerClient instance
   * @param {object} props
   * @param {object} props - yodata client instance
   * @param {string} props.name - local name of the pod
   * @param {string} props.hostname - pod host https://user.example.com
   * @param {string} props.hostkey  - api-key
   * @param {string} props.pathname - root path of the container
   * @param {object} [props.store] - store to use
   * @memberof ContainerClient
   */
  constructor (props) {
    const hostname = ContainerClient.containerURL(props)
    super({ ...props, hostname })
    this.store = props.store || new Store(hostname)
  }

  /**
   * Returns the root url of the container (host + path)
   *
   * @static
   * @param {object} props
   * @param {string} props.hostname - pod host i.e. http://example.com
   * @param {string} [props.pathname] - container path i.e. /event/topic/foo
   * @returns {string} host + path
   * @memberof ContainerClient
   */
  static containerURL (props) {
    const { hostname, pathname } = props
    const cURL =
      typeof pathname === 'string' && pathname.length > 0
        ? new URL(pathname, hostname)
        : new URL(hostname)
    return uri.containerPathify(cURL.href)
  }

  /**
   * get container item by key
   * @param {string} key
   */
  async get (key) {
    return this.store.get(key) || this.http.get(key)
  }

  async post (data) {
    return this.http.post('', data)
  }

  /**
   * List container items
   *
   * @param {object} [props] - params
   * @param {string} [props.from] - start list from the provided token
   * @param {string} [props.by] - timestamp | time | token (default)
   * @param {string} [props.format] - list | full (default)
   * @param {string} [props.hours] - start -(value) hours
   * @returns {Promise<any>} http response
   * @memberof ContainerClient
   */
  async list (props) {
    const from = (props && props.from) || this.store.get('from')
    let target = '?format=full'
    if (typeof from === 'string' && from.length > 0) {
      target += `&from=${from}`
    }
    const targetIsCached = from && this.store.has(target)
    if (targetIsCached) {
      // get data from cache
      return this.store.get(target)
    } else {
      // fetch data from pod
      const defaultValue = {
        contains: []
      }
      return this.data(target, 'data', defaultValue)
        .then(data => {
          if (data && Array.isArray(data.contains)) {
            data.contains = sort(['timestamp'], data.contains)
            if (data.contains.length >= 50) {
              // page is full -> ready for next
              // save data to cache
              data.contains.forEach(message =>
                this.store.set(message.id, message)
              )
              // update history
              this.store.set('next', data.next)
              if (typeof from === 'string' && from.length > 0) {
                this.store.set('from', from)
              }
            }
          }
          return data
        })
        .catch(error => {
          if (defaultValue && error.response && error.response.statusCode === 404) {
            return defaultValue
          } else {
            throw new Error(error.message)
          }
        })
    }
  }

  async next (props = {}) {
    const from = this.store.get('next')
    return this.list({ ...props, from })
  }
}

module.exports = ContainerClient
