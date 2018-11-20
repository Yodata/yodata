const sortObjectKeys = require("sort-object-keys");

const {
  get,
  intersection
} = require("lodash");

const {
  MAP_RESULT
} = require("../events");

const TOKEN = "@keyOrder";

module.exports = function keyOrderPlugin(event, object, context) {
  if (event === MAP_RESULT) {
    let defaultOrder = this.getOption(TOKEN, []);
    let order = this.get(TOKEN, defaultOrder);
    order = intersection(order, Object.keys(object));
    return sortObjectKeys(object, order);
  }

  return object;
};