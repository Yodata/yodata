import isPlainObject from "lodash.isplainobject";

const defaultProps = defaultProps => ({ value }) => {
  if (isPlainObject(value)) {
    return { ...defaultProps, ...value };
  }
  return value;
};

export default defaultProps;
