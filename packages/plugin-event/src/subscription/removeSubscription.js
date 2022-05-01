/**
 * @function removeSubscription
 * @param {SubscriptionItem[]} subs - the subscriptions
 * @param {object} object - object the target params
 * @param {string} object.agent - the subscriber to be removed
 * @param {string} [object.target] - the subscription target (push subscripions only)
 * @returns {SubscriptionItem[]} - the subscription list with the object removed
 */
function removeSubscription(subs = [], object = {}) {
  return subs.filter(item => {
    return !((item.agent === object.agent && item.target === object.target));
  });
}
exports.removeSubscription = removeSubscription;
