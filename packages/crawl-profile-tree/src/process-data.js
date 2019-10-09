
const {endsWith, has, set, get} = require('lodash')

function fixId(id) {
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

function uppercaseit(profile, path) {
  if (has(profile, path)) {
    let value = get(profile, path)
    set(profile, path, String(value).toUpperCase())
  }
}

function processProfileData(profile) {
  profile.id = fixId(profile.id)
  if (Array.isArray(profile.subOrganization)) {
    profile.subOrganization = fixSubOrgIds(profile.subOrganization)
  }

  if (Array.isArray(profile.parentOrganization)) {
    profile.parentOrganization = fixSubOrgIds(profile.parentOrganization)
  }

  uppercaseit(profile, 'identifier.AffiliateID')
  uppercaseit(profile, 'identifier.BrokerID')
  uppercaseit(profile, 'identifier.OfficeID')

  return profile
}

exports.processProfileData = processProfileData
exports.fixSubOrgIds = fixSubOrgIds
exports.fixId = fixId
exports.fixUri = fixUri
exports.uriEquals = uriEquals
