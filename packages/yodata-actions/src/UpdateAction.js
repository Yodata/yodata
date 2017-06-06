import Action from './action'

/**
 * The result object is updated in targetCollection
 * @param {Object} result
 * @param {Object} targetCollectiontype
 * @constructor
 */
const UpdateAction = (result, targetCollection) =>
  new Action({ type: 'UpdateAction', result, targetCollection });

export default UpdateAction
