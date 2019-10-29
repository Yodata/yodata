const fp = require('lodash/fp')
const createPipeline = require('p-pipe')
const validateurl = require('./validate-url')
const assert = require('assert-plus')

const onKey = (key, fn) => {
  assert.string(key)
  assert.func(fn)
  return function (profile) {
    if (Object.keys(profile).includes(key)) {
      profile[key] = fn(profile[key])
    }
    return profile
  }
}
exports.onKey = onKey

const addHash = tag => value => {
  const hash = '#'
  return String(value).includes(hash) ? value : String(value).concat(hash + tag)
}
exports.addHash = addHash

function isProfileId(value) {
  return typeof (value) === 'string' && validateurl(value) && value.endsWith('/profile/card#me') && !value.startsWith('https://null.')
}
exports.isProfileId = isProfileId

const removeInvalidProfileUrls = ary => Array.isArray(ary) ? ary.filter(isProfileId) : ary
exports.removeInvalidProfileUrls = removeInvalidProfileUrls

const normalizeProfileId =
  createPipeline(
    fp.trim,
    fp.toLower,
    addHash('me')
  )
exports.normalizeProfileId = normalizeProfileId

const normalizeUrl = createPipeline(
  fp.trim,
  fp.toLower
)
exports.normalizeUrl = normalizeUrl

function uriEquals(A, B) {
  return (normalizeUrl(A) === normalizeUrl(B))
}
exports.uriEquals = uriEquals

const normalizeSet = iterator => list => {
  let result = new Set(list)
  assert.array(list)
  list.forEach(v => result.add(iterator(v)))
  return [...result]
}
exports.normalizeSet = normalizeSet

