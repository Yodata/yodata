module.exports = {
  type:             "UpdateAction",
  contact:          {
    identifier:             ["_contactKey",
      { name: "BrokerOffice", value: "_originatingSystemContactKey" }],
    honorificPrefix:        "_namePrefix",
    givenName:              "_firstName",
    additionalName:         ["_middleName", "_nickname"],
    familyName:             "_lastName",
    honorificSuffix:        "_nameSuffix",
    name:                   "_fullName",
    jobTitle:               "_jobTitle",
    worksFor:               "_company",
    preferredContactMethod: "_preferredContactMethod",
    preferredPhoneType:     "_preferredPhoneType",
    preferredTime:          "_preferredTime",
    address:                [{
      type:            "PostalAddress",
      identifier:      "_addressKey",
      name:            "_addressType",
      streetAddress:   ["_address1", "_address2"],
      addressLocality: "_city",
      addressRegion:   "_stateOrProvince",
      postalCode:      "_postalCode",
      addressCountry:  "_country",
      dateCreated:     "2017-05-24T20:16:12.8419099-05:00",
      dateModified:    "2017-05-24T20:16:12.8419099-05:00"
    }],
    contactPoint:           [{
      type:         "ContactPoint",
      identifier:   "_emailAddressKey",
      email:        "_emailAddress",
      name:         "_emailType",
      usedForApm:   true,
      dateCreated:  "2017-05-21T14:03:57.8640648-05:00",
      dateModified: "2017-05-21T14:03:57.957819-05:00"
    }],
    comment:                [{
      type:        "Comment",
      identifier:  "_noteKey",
      author:      "_addedByMember",
      value:       "_note",
      dateCreated: "2017-05-24T12:09:45"
    }],
    homeLocation:           [{
      type:         "ContactPoint",
      identifier:   "_homePhoneNumberKey",
      name:         "Home",
      telephone:    "_homePhoneNumber",
      dateCreated:  "2017-05-21T14:03:57.8640648-05:00",
      dateModified: "2017-05-21T14:03:57.957819-05:00"
    }],
    workLocation:           [{
      type:         "ContactPoint",
      identifier:   "_workPhoneNumberKey",
      name:         "Work",
      telephone:    "_workPhoneNumber",
      dateCreated:  "2017-05-21T14:03:57.8640648-05:00",
      dateModified: "2017-05-21T14:03:57.957819-05:00"
    }]
  },
  dateCreated:      "2017-05-21T14:03:57.8796905-05:00",
  dateModified:     "2017-05-21T14:03:57.8796905-05:00",
  acceptedByMember: true,
  recipient:        [{
    type:                  "Organization",
    identifier:            "C90059FD64E6403E9C9A7BE7AAA60C82",
    memberOf:              { identifier: "84D352FB748843A189200CE9B1C3E618" },
    id:                    "https://ct301.ds.bhhsresource.com/profile/card#me",
    originatingSystemName: "Berkshire Hathaway HomeServices",
    name:                  "Berkshire Hathaway HomeServices New England Properties",
    telephone:             "(855) 295-8440",
    faxNumber:             "(860) 571-6904",
    email:                 "clientservices@bhhsne.com",
    officeBranchType:      "Broker",
    officeAor:             "ctgreenw-v",
    officeAorMlsID:        "ctgreenw-v",
    officeBrokerMlsID:     "CTGREENW-CT301",
    address:
                           {
                             streetAddress:   "860 N. Main St.",
                             addressLocality: "Wallingford",
                             addressRegion:   "CT",
                             postalCode:      "06492"
                           },
    timestampEntered:      "2013-09-17T21:04:26.19Z",
    timestampModified:     "2018-01-22T16:55:54.303Z"
  },
    {
      type:           "Person",
      identifier:     "_ownerKey",
      autoAccept:     false,
      assignmentType: "_assignmentType",
      dateCreated:    "2017-05-21T14:03:57.8796905-05:00"
    }],
  instrument:       [{
    leadSource:          "_leadSource",
    subLeadSource:       "_subLeadSource",
    originalReferrerUrl: "_originalReferrerUrl",
    isLead:              true,
    dateCreated:         "2017-05-21T14:03:57.8796905-05:00"
  }],
  includes:         [{
    listingKey:          "7117c767-fbaa-4ed5-8fa7-d1febcf5a50d",
    listingId:           "21705506",
    listAor:             "parayac-v",
    mlsStatus:           "Active",
    listingContractDate: "2017-05-16T00:00:00",
    daysOnMarket:        5,
    listPrice:           169900,
    streetNumber:        "20",
    streetNumberNumeric: 20,
    streetDirPrefix:     null,
    streetName:          "Asbury Ct",
    streetSuffix:        null,
    unitNumber:          null,
    addressLocality:     "Mount Wolf",
    addressRegion:       "PA",
    postalCode:          "17347",
    addressCountry:      "USA",
    countyOrParish:      "York",
    subdivisionName:     "Riverview",
    directions:          null,
    listAgentFirstName:  "Jim",
    listAgentLastName:   "Powers",
    listAgentFullName:   "Jim Powers",
    listAgentEmail:      "jpowers@homesale.com",
    listAgentMlsId:      "3478",
    listOfficeMlsId:     "PRUYOST",
    listingTypeName:     "Residential",
    propertyType:        "Single Family",
    propertySubType:     "2 Story",
    lotSizeArea:         0.2945,
    lotSizeDimensions:   "1/4 - 1/2 Acre",
    poolFeatures:        "Data Unavailable",
    bathroomsTotal:      null,
    bedroomsTotal:       "3",
    garageSpaces:        null,
    stories:             2,
    yearBuilt:           2002,
    heating:             "Gas Heat",
    cooling:             "Window Air Conditioning",
    interiorFeatures:    null,
    exteriorFeatures:    "Shed",
    roof:                "Asphalt Shingle",
    contactNote:         "Situated on a quiet cul-de-sacdlesac in Asbury Pointe, this 3 bedoom, 2 bath home has been freshly painted and new laminate flooring recently installed.  Open layout with vaulted ceiling in living room, spacious eat in kitchen with dining area that has sliding glass doors for deck access. Partially finished lower level w/rough-in plumbing that could be used as family room/extended living space.  Newer roof, Shed & 2 car garage.",
    listBrokerName:      "BERKSHIRE HATHAWAY HOMESALE",
    listBrokerPhone:     "(800) 383-3535",
    propertyUrl:         "http://www.berkshirehathawayhs.com/homesale-realty-pa305/21705506",
    dateCreated:         "2017-05-21T14:03:57.8796905-05:00",
    dateModified:        "2017-05-21T14:03:57.8796905-05:00"
  }]
}
