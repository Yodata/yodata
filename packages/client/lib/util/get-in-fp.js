'use strict'
const get = require('lodash/get')

module.exports = (keypath, defaultValue) => async (object) => get(object, keypath, defaultValue)
