const {endsWith} = require('lodash')
const fp = require('lodash/fp')
const createPipeline = require('p-pipe')
const validateurl = require('./validate-url')
const assert = require('assert-plus')
const getvalue = require('get-value')
const setvalue = require('set-value')

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

const normalizeProfileUri = onKey('id', fixId)

const addHash = tag => value => {
  const hash = '#'
  return String(value).includes(hash) ? value : String(value).concat(hash + tag)
}
exports.addHash = addHash

exports.validuri = validateurl

function isProfileId(value) {
  return typeof (value) === 'string' && validateurl(value) && value.endsWith('/profile/card#me')
}

const rb = key => onKey(key, fp.filter(isProfileId))

const removeInvalidUrls = key => profile => {
  if (Array.isArray(profile[key])) {
    profile[key] = profile[key].filter(validateurl)
  }
  return profile
}
exports.removeInvalidUrls = removeInvalidUrls

const fixProfileId = createPipeline(
  fp.trim,
  fp.toLower,
  addHash('me'),
)
exports.fixProfileId = fixProfileId

function fixId(_id_) {
  const id = _id_.trim().toLowerCase()
  return endsWith(id, '#me') ? id.toLowerCase() : `${id}#me`.toLowerCase()
}

function uriEquals(A, B) {
  return (fixUri(A) === fixUri(B))
}

function fixUri(uri) {
  return endsWith(uri, '#me') ? uri.toLowerCase() : `${uri}#me`.toLowerCase()
}

function fixSubOrgIds(list) {
  const ary = (Array.isArray(list)) ? list.map(fixUri) : list
  const set = new Set(ary)
  return [...set]
}

const removeBadUris = key => profile => {
  const pass = true
  const fail = false

  if (Array.isArray(profile[key])) {
    profile[key] = profile[key].filter(function (v) {
      const value = String(v)
      if (value === '') {
        return fail
      }
      if (value.includes('null.bhhs')) {
        return fail
      }
      return pass
    })
  }
  return profile
}

const processProfile = createPipeline(
  normalizeProfileUri('id'),
  removeBadUris('subOrganization'),
  removeBadUris('parentOrganization'),
)

// function processProfileData(profile) {
//   profile.id = fixId(profile.id)
//   if (Array.isArray(profile.subOrganization)) {
//     profile.subOrganization = fixSubOrgIds(profile.subOrganization)
//   }

//   if (Array.isArray(profile.parentOrganization)) {
//     profile.parentOrganization = fixSubOrgIds(profile.parentOrganization)
//   }

//   uppercaseit(profile, 'identifier.AffiliateID')
//   uppercaseit(profile, 'identifier.BrokerID')
//   uppercaseit(profile, 'identifier.OfficeID')

//   return profile
// }

exports.processProfileData = processProfile
exports.fixSubOrgIds = fixSubOrgIds
exports.fixId = fixId
exports.fixUri = fixUri
exports.uriEquals = uriEquals

const hasvalue = require('lodash/has')

exports.cleanMemberOf = async data => {
  if (process.env.CLEAN_PROFILE_DATA === 'true') {
    return cleanMemberOf(data)
  }
  return data
}

async function cleanMemberOf(data) {
  // remove memberOf values that do not have an identifier
  const key = 'data.object.memberOf'
  const value = getvalue(data, key)
  if (Array.isArray(value)) {
    const nextValue = value.filter(v => hasvalue(v, 'identifier'))
    setvalue(data, key, nextValue)
  }
  return data
}
