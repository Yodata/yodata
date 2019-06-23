const Client = require('@yodata/client')
const sort = require('./sort-container-items')
const Store = require('./json-store')
// eslint-disable-next-line node/no-deprecated-api
const { URL, resolve } = require('url')

class Container extends Client {
  /**
   *
   * @param {object} props
   * @param {object} props - yodata client instance
   * @param {string} props.name - local name of the pod
   * @param {string} props.hostname - pod host https://user.example.com
   * @param {string} props.hostkey  - api-key
   * @param {string} props.pathname - root path of the container
   * @param {object} [props.store] - store to use
   */
  constructor (props) {
    const uri = new URL(Container.containerURL(props))
    super({ ...props, hostname: uri.href })
    this.store = props.store || new Store(uri.href)
  }

  static containerURL ({ pathname, hostname }) {
    const pth = String(pathname).endsWith('/') ? pathname : pathname + '/'
    return resolve(hostname, pth)
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
   * @memberof Container
   */
  async list (props) {
    const from = (props && props.from) || this.store.get('from')
    let target = '?format=full'
    if (typeof from === 'string' && from.length > 0) {
      target += `&from=${from}`
    }
    let response
    const targetIsCached = (from && this.store.has(target))
    if (targetIsCached) {
      // get data from cache
      response = this.store.get(target)
    } else {
      // fetch data from pod
      response = await this
        .data(target, 'data', { contains: [] })
        .then(data => {
          if (data && Array.isArray(data['contains'])) {
            data['contains'] = sort([ 'timestamp' ], data['contains'])
            if (data['contains'].length >= 50) { // page is full -> ready for next
              // save data to cache
              data['contains'].forEach(message => this.store.set(message.id, message))
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
          console.error(error)
          throw new Error(error.message)
        })
    }
    return response
  }

  async next (props = {}) {
    const from = this.store.get('next')
    return this.list({ ...props, from })
  }
}

exports.Container = Container
