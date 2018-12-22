const curie = require('./curie-regexp')

module.exports = string => {
  const [uri, prefix, pathname] = curie.exec(string);
  return {
    uri,
    prefix,
    pathname
  };
};