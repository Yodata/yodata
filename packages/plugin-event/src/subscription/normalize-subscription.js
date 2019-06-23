const assert = require('assert-plus')
const kindOf = require('kind-of')
const set = require('lodash/set')
const { uri } = require('@yodata/cli-tools')
/**
 * Normalizes CLI input => {object, agent, target}
 * @param {object} props - subscription input
 * @param {string} props.host - host pod baseurl
 * @param {string} [props.agent] - subscriber profileURI i.e. https://user.example.com/profile/card#me
 * @param {string} [props.object] - the subscription path i.e. /event/topic/realestate/contact#
 * @param {string} [props.target] - for webhook delivery
 * @param {string} [props.context] - for outbound transformation
 * @returns {object} normalized subscription
 */
function normalizeSubscription (props) {
  const result = {}
  const { agent, object, target, context, host } = props

  result.object = formatPath(object)
  result.agent = formatAgent(agent, host)

  if (context) {
    set(result, [ 'scope', object, 'context' ], context)
  }

  if (kindOf(target) === 'string') {
    // If target, agent must be deleted
    delete result.agent
  }

  return result
}

function formatAgent (value, host) {
  assert.string(value, 'agent must be a string')
  if (value.endsWith(':')) {
    value += 'profile/card#me'
  }

  return uri.resolve(value, host)
}

function formatPath (value) {
  assert.ok(uri.isPath(value), 'subscription.object must be a valid path')
  if (value.startsWith('/')) {
    return value
  }

  if (!value.startsWith('/')) {
    value = '/' + value
  }

  if (!value.startsWith('/event/topic')) {
    value = '/event/topic' + value
  }

  return value
}

exports.normalizeSubscription = normalizeSubscription
