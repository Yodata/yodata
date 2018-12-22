const { Store, Parser, DataFactory, Util } = require("n3");
const request = require("./request-rdf");
const logger = require('./logger')
const prefixIndex = require('./prefixIndex')
const ow = require("ow");
const isCurie = require('./is-curie')

module.exports = class Schema {
  constructor() {
    this.prefix = Util.prefixes()
    this.graph = Store();
  }

  addPrefix(prefix, url) {
    if (typeof url !== 'string') {
      return this.prefix(prefix, prefixIndex[prefix])
    }
  }

  async import(uri) {
    ow(id, ow.string);
    const store = this.graph;
    await request(uri)
      .then(quads => {
        logger.log({quads})
        store.addQuads(quads);
        logger.debug(`${quads.length} quads added`);
      });
    return this;
  }

  static fromJsonSchema(jsonSchema) {
    return new Schema(jsonSchema)
  }

  async add(id) {
    ow(id, ow.string);
    const store = this.graph;
    await request(id)
      .then(quads => {
        logger.log({quads})
        store.addQuads(quads);
        logger.debug(`${quads.length} quads added`);
      });
    return this;
  }

  async remove(id) {
    ow(id, ow.string)
    return this
  }

  has(subject, predicate, object) {
    return (this.graph.countQuads(subject,predicate,object) > 0)
  }

  get(subject, predicate) {
    return this.graph.getQuads(subject, predicate);
  }

  fetch(IRI) {
    const store = this.graph;
    request(IRI)
      .then(quads => {
        store.addQuads(quads);
        logger.debug(`${quads.length} quads added`);
      });
    return this;
  }
};