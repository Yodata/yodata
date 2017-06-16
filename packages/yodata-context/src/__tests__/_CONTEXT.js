import { MOCK_EVENT as DATA } from '../_mockData'
import CONTEXT from '../_CONTEXT'
import Context from '../context'

const EXPECTED_RESULT = {
  type: 'UpdateAction',
  contact: {
    identifier: [ '_contactKey', { name: 'BrokerOffice', value: '_originatingSystemContactKey' } ],
    honorificPrefix: '_namePrefix',
    givenName: '_firstName',
    additionalName: [ '_middleName', '_nickname' ],
    familyName: '_lastName',
    honorificSuffix: '_nameSuffix',
    name: '_fullName',
    jobTitle: '_jobTitle',
    worksFor: '_company',
    preferredContactMethod: '_preferredContactMethod',
    preferredPhoneType: '_preferredPhoneType',
    preferredTime: '_preferredTime',
    address: [ {
      type: 'PostalAddress',
      identifier: '_addressKey',
      name: '_addressType',
      streetAddress: [ '_address1', '_address2' ],
      addressLocality: '_city',
      addressRegion: '_stateOrProvince',
      postalCode: '_postalCode',
      addressCountry: '_country',
      dateCreated: '2017-05-24T20:16:12.8419099-05:00',
      dateModified: '2017-05-24T20:16:12.8419099-05:00',
    } ],
    contactPoint: [
      {
        type: 'ContactPoint',
        identifier: '_emailAddressKey',
        email: '_emailAddress',
        name: '_emailType',
        usedForApm: true,
        dateCreated: '2017-05-21T14:03:57.8640648-05:00',
        dateModified: '2017-05-21T14:03:57.957819-05:00',
      },
      {
        type: 'ContactPoint',
        identifier: '_phoneNumberKey',
        name: '_phoneNumberType',
        telephone: '_phoneNumber',
        dateCreated: '2017-05-21T14:03:57.8640648-05:00',
        dateModified: '2017-05-21T14:03:57.957819-05:00',
      },
    ],
    comment: [ {
      identifier: '_noteKey',
      author: '_addedByMember',
      value: '_note',
      dateCreated: '2017-05-24T12:09:45',
    } ],
  },
  recipient: [ {
    type: [ 'Organization', 'RealEstateAgent' ],
    identifier: '_ownerKey',
    autoAccept: false,
    assignmentType: '_assignmentType',
    dateCreated: '2017-05-21T14:03:57.8796905-05:00',
  },
    {
      type: [ 'Person', 'RealEstateAgent' ],
      identifier: '_ownerKey',
      autoAccept: false,
      assignmentType: '_assignmentType',
      dateCreated: '2017-05-21T14:03:57.8796905-05:00',
    }],
  instrument: [ {
    leadSource: '_leadSource',
    subLeadSource: '_subLeadSource',
    originalReferrerUrl: '_originalReferrerUrl',
    isLead: true,
    dateCreated: '2017-05-21T14:03:57.8796905-05:00',
  } ],
  mentions: [ {
    listingKey: '7117c767-fbaa-4ed5-8fa7-d1febcf5a50d',
    listingId: '21705506',
    listAor: 'parayac-v',
    mlsStatus: 'Active',
    listingContractDate: '2017-05-16T00:00:00',
    daysOnMarket: 5,
    listPrice: 169900,
    streetNumber: '20',
    streetNumberNumeric: 20,
    streetDirPrefix: null,
    streetName: 'Asbury Ct',
    streetSuffix: null,
    unitNumber: null,
    addressLocality: 'Mount Wolf',
    addressRegion: 'PA',
    postalCode: '17347',
    addressCountry: 'USA',
    countyOrParish: 'York',
    subdivisionName: 'Riverview',
    directions: null,
    listAgentFirstName: 'Jim',
    listAgentLastName: 'Powers',
    listAgentFullName: 'Jim Powers',
    listAgentEmail: 'jpowers@homesale.com',
    listAgentMlsId: '3478',
    listOfficeMlsId: 'PRUYOST',
    listingTypeName: 'Residential',
    propertyType: 'Single Family',
    propertySubType: '2 Story',
    lotSizeArea: 0.2945,
    lotSizeDimensions: '1/4 - 1/2 Acre',
    poolFeatures: 'Data Unavailable',
    bathroomsTotal: null,
    bedroomsTotal: '3',
    garageSpaces: null,
    stories: 2,
    yearBuilt: 2002,
    heating: 'Gas Heat',
    cooling: 'Window Air Conditioning',
    interiorFeatures: null,
    exteriorFeatures: 'Shed',
    roof: 'Asphalt Shingle',
    contactNote: 'Situated on a quiet cul-de-sacdlesac in Asbury Pointe, this 3 bedoom, 2 bath home has been freshly painted and new laminate flooring recently installed.  Open layout with vaulted ceiling in living room, spacious eat in kitchen with dining area that has sliding glass doors for deck access. Partially finished lower level w/rough-in plumbing that could be used as family room/extended living space.  Newer roof, Shed & 2 car garage.',
    listBrokerName: 'BERKSHIRE HATHAWAY HOMESALE',
    listBrokerPhone: '(800) 383-3535',
    propertyUrl: 'http://www.berkshirehathawayhs.com/homesale-realty-pa305/21705506',
    dateCreated: '2017-05-21T14:03:57.8796905-05:00',
    dateModified: '2017-05-21T14:03:57.8796905-05:00',
  } ],
  acceptedByMember: true,
  dateCreated: '2017-05-21T14:03:57.8796905-05:00',
  dateModified: '2017-05-21T14:03:57.8796905-05:00',
}

describe('context', () => {
  const context = new Context(CONTEXT)
  const result = context.map(DATA)
  const expected = EXPECTED_RESULT

  test(`ContactEvent.PrimaryEvent => type`, () => {
    expect(result.type).toEqual('UpdateAction')
  })

  test(`contactPoints`, () => {
    expect(result.contact.contactPoint).toEqual(expected.contact.contactPoint)
  });

  test(`addresses => address`, () => {
    expect(result.contact.address).toEqual(expected.contact.address)
  });

  test(`contact`, () => {
    expect(result.contact).toEqual(expected.contact);
  })

  test(`notes => contact.comment`, () => {
    expect(result.contact.comment).toEqual(expected.contact.comment)
  })

  test(`assignments => recipient`, () => {
    expect(result.recipient).toEqual(expected.recipient)
  });

  test(`leadSource => instrument`, () => {
    expect(result.instrument).toEqual(expected.instrument)
  });
})
