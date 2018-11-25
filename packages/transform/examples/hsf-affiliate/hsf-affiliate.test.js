const fs = require("fs")
const path = require("path")
const yaml = require("js-yaml")
const Context = require("../../src/context")
const pluginKeyOrder = require("../../src/plugin/key-order")
const pluginDefaultValues = require("../../src/plugin/plugin-default-values")
const parsedContext = require("./affiliate-context")

const yamlCdef = fs.readFileSync(path.join(__dirname, "/affiliate.yaml"), "utf8")
const context = Context.fromYaml(yamlCdef).use(pluginDefaultValues).use(pluginKeyOrder)
const input = fs.readFileSync(path.join(__dirname, "/affiliate.in.yaml"), "utf8")
const output = fs.readFileSync(path.join(__dirname, "/affiliate.out.yaml"), "utf8")
const object = yaml.load(input)
const expected = yaml.load(output)
const result = context.map(object)

test("parse affiliate @default ", () => {
  let defaultValues = context.get("@default")
  expect(defaultValues).toEqual(parsedContext["@default"])
})

test("parse affiliate @keyOrder", () => {
  expect(context.get("@keyOrder")).toEqual(["type",
    "id",
    "name",
    "contactPoint",
    "email",
    "telephone",
    "faxNumber",
    "url",
    "identifier"
  ])
})

test("hsf-affiliate address", () => {
  expect(result.address).toEqual(expected.address)
})
test("hsf-affiliate additionalProperty", () => {
  expect(result.additionalProperty).toEqual(expected.additionalProperty)
})
test("hsf-affiliate address", () => {
  expect(result.address).toEqual(expected.address)
})
test("telephone", () => {
  return expect(result.telephone).toEqual(expected.telephone)
})
test("mlsMembership", () => {
  let data = {
    AffiliateID: 'AffiliateID',
    AffiliateMLSID1: "AffiliateMLSID1"
  }
  let expected = {
    memberOf: {
      type:     "OrganizationRole",
      roleName: "MLSMember",
      member:   "https://affiliateid.ds.bhhsresource.com/profile/card#me",
      memberId: "AffiliateMLSID1",
      memberOf: {
        type: "MultipleListingService",
        name: "AffiliateMLSName1"
      }
    }
  }
  let cdef = {
    AffiliateMLSID1: {
      id:    "memberOf",
      type:  "MLSMembership",
      member:   props => `https://${props.object["AffiliateID"].toLowerCase()}.ds.bhhsresource.com/profile/card#me`,
      value: {
        memberOf: {
          type: 'MultipleListingService',
          name: '#name'
        },
        memberId: "#MLSID",

      }
    }
  }
  let context = new Context(cdef)
  expect(context.map(data)).toEqual(expected)
})
test("email", () => {
  return expect(result.email).toEqual(expected.email)
})
test("memberOf", () => {
  return expect(result["memberOf"]).toEqual(expected["memberOf"])
})

test("hsf-affiliate owner", () => {
  expect(result.owner).toEqual(expected.owner)
})

test("hsf-affiliate parentOrganization", () => {
  expect(result["parentOrganization"]).toEqual(expected["parentOrganization"])
})

test("hsf.market.designations", () => {
  expect(context.get("MarketDesignationsList")).toMatchObject({
    key:        "memberOf",
    "@context": {
      DesignationType:   "roleName",
      GrantedOnDate:     "startDate",
      ExpirationDate:    "endDate",
      GrantingAuthority: {
        key: "memberOf"
      }
    }
  })
})

test("full-context", () => {
  return expect(result).toEqual(expected)
})


