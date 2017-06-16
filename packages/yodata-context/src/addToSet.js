/**
 * Creates a new array from two sets without dupllicate values.
 *
 * @param {*} currentValue - [ a , b ]
 * @param {*} newValue - [ b , c ]
 *
 * @return {Array} -  [ a , b , c ]
 *
 * @example
 * addToSet( 1 , 2 ) => [ 1 , 2 ]
 * addtoSet( [ 1 , 2 ], [ 2 , 3 ] ) => [ 1 , 2 , 3 ]
 *
 */
import isNil from 'lodash/isNil'
import unionWith from 'lodash/unionWith'
import castArray from 'lodash/castArray'
import isEqual from 'lodash/isEqual'
import { curry, get, set } from 'lodash'

const addToSet = (currentValue, newValue) => {
  if (isNil(currentValue)) {
    return newValue;
  }

  return unionWith(castArray(currentValue), castArray(newValue), isEqual)
};

export const ats = curry((dest, key, val) => {
  let currentValue = get(dest, key)
  let nextValue = addToSet(currentValue, val);
  return set(dest, key, nextValue);
})

export default addToSet

