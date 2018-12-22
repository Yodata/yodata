const parse = require("../parse-yaml-schema");

test("expands !id type ", async () => {
  const yaml = `
  name: 'schema:name'
  `;
  let result = await parse(yaml);
  expect(result).toEqual({
      "name": {
        "@id": "schema:name",
        "description": "rdfs:comment",
        "domainIncludes": "schema:domainIncludes",
        "name": "localName",
        "rangeIncludes": "schema:rangeIncludes",
        "subClassOf": "rdfs:subClassOf",
        "subPropertyOf": "rdfs:subPropertyOf",
        "title": "rdfs:label",
        "type": "schema:rangeIncludes"
      }
    }
  );
});