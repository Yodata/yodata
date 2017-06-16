import { KEYMAP, VALMAP } from './constants'
import { get, isFunction, isNull, isPlainObject, isString, set, transform } from 'lodash'

const returnValue = props => props.value

const parseContext = contextDefinition => {
  return transform(
    contextDefinition,
    (context, value, key) => {
    const setKey = val => set(context, [ KEYMAP, key ], val);
    const setVal = val => set(context, [ VALMAP, key ], val);

    if (isNull(value)) {
      setKey(value)
      return context;
    }
    if (isString(value)) {
      setKey(value)
      return context;
    }
    if (isFunction(value)) {
      setKey(key)
      setVal(value)
      return context;
    }
    if (isPlainObject(value)) {
      let nextKey = get(value, 'key', key);
      let nextValue = get(value, 'val', returnValue)
      setKey(nextKey)
      setVal(nextValue)
      return context
    }
    throw new Error(`Unable to process context for ${key}:${value}`);
  },
    {}
  );
};

export default parseContext
