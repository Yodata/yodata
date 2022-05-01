/**
 * REPLACE an existing subscription without merging subscriptions
 * @param {SubscriptionItem[]} subs - the subscription list
 * @param {SubscriptionItem} object - the subscription to be replaced or added
 * @returns {SubscriptionItem[]} the subscription list with the object replaced or added
 */
function replaceSubscription(subs = [], object = {}) {
  const existingSubscriptionFound = subs.findIndex(item => {
    return ((item.agent === object.agent && item.target === object.target));
  });
  if (existingSubscriptionFound !== -1) {
    const current = subs[ existingSubscriptionFound ];
    object.version = (Number(current.version) + 1).toString();
    subs[ existingSubscriptionFound ] = object;
  } else {
    subs.push(object);
  }
  return subs;
}
exports.replaceSubscription = replaceSubscription;
