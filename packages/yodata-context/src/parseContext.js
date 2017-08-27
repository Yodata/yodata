import { KEYMAP, VALMAP } from "./constants";
import { default as transform } from "lodash.transform";
import { default as set } from "lodash.set";
import { default as isNull } from "lodash.isnull";
import { default as isPlainObject } from "lodash.isplainobject";
import { default as get } from "lodash.get";
import { default as isString } from "lodash.isstring";
import { default as isFunction } from "lodash.isfunction";

const returnValue = props => props.value;

const parseContext = contextDefinition => {
  return transform(
    contextDefinition,
    (context, value, key) => {
      const setKey = val => set(context, [KEYMAP, key], val);
      const setVal = val => set(context, [VALMAP, key], val);

      if (isNull(value)) {
        setKey(value);
        return context;
      }
      if (isString(value)) {
        setKey(value);
        return context;
      }
      if (isFunction(value)) {
        setKey(key);
        setVal(value);
        return context;
      }
      // advanced context definition syntax
      if (isPlainObject(value)) {
        setKey(get(value, "key", key));
        setVal(get(value, "val", returnValue));

        if (value.context) {
          // this hack will break if the subContext overwrites a key
          // in the parent context.
          // todo: implement subContext at JSON node level to avoid conflicts
          let subContext = parseContext(value.context);
          Object.assign(context[KEYMAP], subContext[KEYMAP]);
          Object.assign(context[VALMAP], subContext[VALMAP]);
        }
        return context;
      }
      // bad format
      throw new Error("parseContext error");
    },
    {}
  );
};

export default parseContext;
