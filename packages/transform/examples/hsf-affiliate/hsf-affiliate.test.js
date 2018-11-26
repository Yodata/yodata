const fs = require("fs")
const path = require("path")
const yaml = require("js-yaml")
const Context = require("../../src/context")
const pluginKeyOrder = require("../../src/plugin/key-order")
const pluginDefaultValues = require("../../src/plugin/plugin-default-values")
const parsedContext = require("./affiliate-context")
const { CONTAINER, SET, NEST } = require("../../src/terms")

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
test("hsf-affiliate owner", () => {
  expect(result.owner).toEqual(expected.owner)
})
test("telephone", () => {
  return expect(result.telephone).toEqual(expected.telephone)
})
test("mlsMembership", () => {
  let data = {
    AffiliateID:        "AffiliateID",
    AffiliateMLSID:     "AffiliateMLSID",
    AffiliateMLSID1:    "AffiliateMLSID1",
    AffiliateMLSID15:   "AffiliateMLSID15",
    AffiliateMLSName1:  "AffiliateMLSName1",
    AffiliateMLSName15: "AffiliateMLSName15"
  }
  let expected = {
    memberOf: [
      {
        type:     "OrganizationRole",
        roleName: "MLSMember",
        memberId: "AffiliateMLSID1",
        memberOf: "AffiliateMLSName1"
      }
    ]
  }
  let cdef = {
    "@additionalProperties": false,
    AffiliateMLSID1:         {
      id:    "memberOf",
      value: {
        type:     "OrganizationRole",
        roleName: "MLSMember",
        memberId: "#value",
        memberOf: "#AffiliateMLSName1"
      }
    },
    memberOf:                {
      [CONTAINER]: SET
    }
  }
  let context = new Context(cdef)
  expect(context.map(data)).toEqual(expected)
})
test("hsf-affiliate market-designations", () => {
  const data = {
    MarketDesignationsList: {
      MarketDesignationList: [
        {
          DesignationType:   "DT1",
          ExpirationDate:    "ED1",
          GrantedOnDate:     "GOD1",
          GrantingAuthority: "GA1"
        },
        {
          DesignationType:   "DT2",
          ExpirationDate:    "ED2",
          GrantedOnDate:     "GOD2",
          GrantingAuthority: "GA2"
        }
      ]
    }
  }
  const expected = {
    memberOf: [
      {
        // type:     'OrganizationRole',
        roleName:   "DT1",
        endDate:    "ED1",
        startDate:     "GOD1",
        grantingAuthority: "GA1"
      },
      {
        // type:     'OrganizationRole',
        roleName:   "DT2",
        endDate:    "ED2",
        startDate:     "GOD2",
        grantingAuthority: "GA2"
      }
    ]
  }
  const cdef = {
    MarketDesignationsList: {
      id: 'memberOf',
      type: 'OrganizationRole',
      value: '#MarketDesignationList'
    },
    DesignationType:   'roleName',
    ExpirationDate:    "endDate",
    GrantedOnDate:     "startDate",
    GrantingAuthority: "grantingAuthority"
  }
  const context = new Context(cdef)
  expect(context.map(data)).toEqual(expected)
})
test("email", () => {
  return expect(result.email).toEqual(expected.email)
})



test("hsf-affiliate parentOrganization", () => {
  expect(result["parentOrganization"]).toEqual(expected["parentOrganization"])
})


test("full-context", () => {
  return expect(result).toEqual(expected)
})


