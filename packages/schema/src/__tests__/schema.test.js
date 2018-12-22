const Schema = require("../schema");
const IRI = "http://schema.org/Action";

test("constructor: new Schema()", () => {
  const schema = new Schema();
  expect(schema).toBeInstanceOf(Schema);
});

test("schema.add(namespace) imports an rdfs vocabulary into the current schema", async () => {
  const schema = new Schema();
  const rdfs = "http://www.w3.org/2000/01/rdf-schema#";
  await schema.add(rdfs);
  return expect(schema.has(rdfs)).toBeTruthy();
});

test("schema.add(term) imports a namespace term", done => {
  new Schema()
    .add("http://www.w3.org/2000/01/rdf-schema#Class")
    .then(schema => {
      expect(schema.has("http://www.w3.org/2000/01/rdf-schema#Class")).toBeTruthy();
      done();
    });
});

test("fromJsonSchema", () => {
  const jsonSchema = {};
  return expect(Schema.fromJsonSchema(jsonSchema)).toEqual({
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "http://example.com/root.json",
    "type": "object",
    "title": "The Root Schema",
    "required": [
      "checked",
      "dimensions",
      "id",
      "name",
      "price",
      "tags",
  });
});