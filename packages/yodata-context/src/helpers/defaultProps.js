import isPlainObject from 'lodash/isPlainObject';

const defaultProps = defaultProps => ({ value }) => {
  if (isPlainObject(value)) {
    return { ...defaultProps, ...value }
  }
  return value
}

export default defaultProps
