const n3 = require('n3')
const Store = n3.Store
const Parser = n3.Parser
const fs = require('fs')

module.exports = class SchemaStore extends Store {
  static create () {
    return new SchemaStore()
  }
  /**
     * adds data from file to a store
     * @param {string} filePath
     * @returns {SchemaStore}
     */
  importFile (filePath) {
    let store = this
    return new Promise((resolve, reject) => {
      let data = fs.createReadStream(filePath)
      let parser = new Parser()
      parser.parse(data, (err, quad) => {
        if (err) reject(err)
        else if (quad) store.addQuad(quad)
        else resolve(store)
      })
    })
  }
  add(name, {type, graph}) {
    this.addQuad()
  }
}