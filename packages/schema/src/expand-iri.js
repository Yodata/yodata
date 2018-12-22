const curie = new RegExp("([\\w\\d]*:{1})([\\w][\\w\\d\\/#]*)");
const isCurie = string => curie.test(string);
const splitCurie = string => {
  const [uri, prefix, pathname] = curie.exec(string);
  return {
    uri,
    prefix,
    pathname
  };
};

module.exports = (prefixMap = {}, iri) => {
  if (typeof iri === "string" && isCurie(iri)) {
    const { prefix, pathname } = splitCurie(iri);
    if (prefixMap.hasOwnProperty(prefix)) {
      return prefixMap[prefix] + pathname
    }
  }
  return iri
};
