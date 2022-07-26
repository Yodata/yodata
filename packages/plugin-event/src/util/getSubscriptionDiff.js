/**
 *
 *
 * @param {string[]} source - source subscriptions array
 * @param {string[]} target - target subscriptions array
**/
function getSubscriptionDiffs (source, target) {
  const deletes = target.filter(x => source.indexOf(x) === -1)
  const adds = source.filter(x => target.indexOf(x) === -1)

  return {
    adds,
    deletes
  }
}

module.exports = getSubscriptionDiffs
