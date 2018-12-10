const { fromJS } = require("immutable")
const context = require("./context")
const input = require("./input")
const output = {
  v1: require("./output.v1"),
  v2: context.map(input)
}
const applyChanges = object => {
  /**
   * # v2 changes
   * address.identifier => address.addressKey
   * contactPoint.identifier => contactPoint.emailAddressKey
   * contactPoint.identifier => contactPoint.homePhoneNumberKey
   *
   */
  let next = fromJS(object)
  let contact = next.get("contact")
  // address.identifier => address.addressKey
  let nextAddress = contact.getIn(["address", "0"]).set("addressKey", "_addressKey").delete("identifier")
  contact = contact.setIn(["address", "0"], nextAddress)
  // comment changes
  let commentKey = ["comment", "0"]
  let comment = contact
    .getIn(commentKey)
    .set("text", "_note")
    .set("noteKey", "_noteKey")
    .delete("identifier")
    .delete("value")
  contact = contact.setIn(commentKey, comment)
  // move contactPoint.identifier to contactPoint.emailAddressKey
  let contactPoint = contact.getIn(['contactPoint','0'])
    .delete('identifier')
    .set('emailAddressKey','_emailAddressKey')
  contact = contact.setIn(['contactPoint','0'], contactPoint)

  /**
   * "identifier": "_homePhoneNumberKey",
   * "phoneNumberKey": "_homePhoneNumberKey",
   */
  let homeLocation = contact.getIn(['homeLocation','0'])
    .delete('identifier')
    .set('phoneNumberKey', '_homePhoneNumberKey')
  contact = contact.setIn(['homeLocation','0'], homeLocation)

  let workLocation = contact.getIn(['workLocation','0'])
    .delete('identifier')
    .set('phoneNumberKey', '_workPhoneNumberKey')
  contact = contact.setIn(['workLocation','0'], workLocation)

  contact = contact
    .delete('identifier')
    .set('originatingSystemContactKey', '_originatingSystemContactKey')
    .set('originatingSystemName', 'BrokerOffice')
    .set('contactKey', '_contactKey')

  next = next.set("contact", contact)

  next = next.set('recipient',
    [
      {
        "type": "RealEstateAgent",
        "ownerKey": "E625DE61ACED4587BF2D73847643883C",
        "assignmentType": "Lead",
        "dateCreated": "2018-11-25T18:18:47.0224021-06:00",
        "id": "https://3004543.rl.hsaffiliates.com/profile/card#me",
        "name": "REALLIVING"
      }
    ])

  return next.toJS()
}

describe("red-context", () => {
  const v2 = output.v2
  const v1 = applyChanges(output.v1)

  test(`contactEvent.primaryEvent => type`, () => {
    const result = v2.type
    const expected = v1.type
    expect(result).toEqual(expected)
  })

  test(`contact.address`, () => {
    const result = v2.contact.address
    const expected = v1.contact.address
    expect(result).toEqual(expected)
  })

  test(`contact.contactPoint`, () => {
    const result = v2.contact.contactPoint
    const expected = v1.contact.contactPoint
    expect(result).toEqual(expected)
  })

  test(`contact.comment`, () => {
    const result = v2.contact.comment
    const expected = v1.contact.comment
    expect(result).toEqual(expected)
  })

  test(`contact`, () => {
    const result = v2.contact
    const expected = v1.contact
    expect(result).toEqual(expected)
  })

  test(`assignments => recipient`, () => {
    const result = v2.recipient
    const expected = v1.recipient
    expect(result).toEqual(expected)
  })

  test(`leadSource => instrument`, () => {
    const result = v2.instrument
    const expected = v1.instrument
    console.log({ result, expected })
    expect(result).toEqual(expected)
  })
})

