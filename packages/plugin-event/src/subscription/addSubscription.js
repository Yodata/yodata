/**
 * updates an esiting subscription by adding the sub and pub topics
 * does not create duplicates and keeps the arrays pub/sub arrays sorted
 * @param {object[]} subs - the subscription items list to be up dated
 * @param {*} object
 * @returns
 */
function addSubscription(subs = [], object = {}) {
  const existingSubscriptionFound = subs.findIndex(item => {
    return ((item.agent === object.agent && item.target === object.target));
  });
  if (existingSubscriptionFound !== -1) {
    const current = subs[ existingSubscriptionFound ];
    const version = current.version ? Number(current.version) + 1 : object.version;
    const subscribes = new Set([ ...object.subscribes, ...current.subscribes ]);
    const publishes = new Set([ ...object.publishes, ...current.publishes ]);
    current.version = String(version);
    current.subscribes = Array.from(subscribes).sort();
    current.publishes = Array.from(publishes).sort();
    current.lastModifiedBy = object.lastModifiedBy
    current.lasModifiedDate = object.lasModifiedDate
  } else {
    subs.push(object);
  }
  return subs;
}
exports.addSubscription = addSubscription;
