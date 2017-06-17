import getSQSMessage from './getSQSMessage'

const fn = jest.fn(getSQSMessage)
  .mockReturnValueOnce({
    Type: 'Notification',
    MessageId: '3a6e761b-6abb-5b34-94f8-27808c5bced9',
    TopicArn: 'arn:aws:sns:us-west-2:228463753594:BHHS_Franchise_YoData_Queue',
    Message: '{"contactKey":"cff51a22-69b4-486f-9c9e-b67c7849eb0d","originatingSystemContactKey":"","originatingSystemName":"BrokerOffice","namePrefix":null,"firstName":"Heather","middleName":"","lastName":"Schmidt","nameSuffix":null,"fullName":"Heather Schmidt","nickname":null,"jobTitle":null,"company":null,"acceptedByMember":false,"preferredContactMethod":"No Preference","preferredPhoneType":null,"preferredTime":"","timestampEntered":"2017-05-21T14:03:57.8796905-05:00","timestampModified":"2017-05-21T14:03:57.8796905-05:00","addresses":[],"emailAddresses":[{"emailAddressKey":"2c935f33-5f89-46be-87c2-f06b986f9df1","emailAddress":"heatherlschmidt@yahoo.com","emailType":"primary","usedForApm":true,"timestampEntered":"2017-05-21T14:03:57.8640648-05:00","timestampModified":"2017-05-21T14:03:57.957819-05:00"}],"phoneNumbers":[{"phoneNumberKey":"1640e567-d6c5-414c-a714-7732e41370f1","phoneNumberType":"Work","phoneNumber":"7175783500","timestampEntered":"2017-05-21T14:03:57.8640648-05:00","timestampModified":"2017-05-21T14:03:57.957819-05:00"}],"assignments":[{"ownerType":"Office","ownerKey":"3E3A2109315547188A5DCBDABFCDDCC0","autoAccept":null,"assignmentType":"Lead","timestampEntered":"2017-05-21T14:03:57.8796905-05:00"}],"notes":[null],"leadSources":[{"leadSource":"Office Website","subLeadSource":"Saved Property","originalReferrerUrl":"http://www.berkshirehathawayhs.com/Homesale-Realty-PA305/listing/listingsearch.aspx?search=3ddb7b44-d1f2-41db-90ae-7eb5c08ebe5a","isLead":true,"timestampEntered":"2017-05-21T14:03:57.8796905-05:00"}],"properties":[{"listingKey":"7117c767-fbaa-4ed5-8fa7-d1febcf5a50d","listingId":"21705506","listAor":"parayac-v","mlsStatus":"Active","listingContractDate":"2017-05-16T00:00:00","daysOnMarket":5,"listPrice":169900.0,"streetNumber":"20","streetNumberNumeric":20.0,"streetDirPrefix":null,"streetName":"Asbury Ct","streetSuffix":null,"unitNumber":null,"city":"Mount Wolf","stateOrProvince":"PA","postalCode":"17347","country":"USA","countyOrParish":"York","subdivisionName":"Riverview","directions":null,"listAgentFirstName":"Jim","listAgentLastName":"Powers","listAgentFullName":"Jim Powers","listAgentEmail":"jpowers@homesale.com","listAgentMlsId":"3478","listOfficeMlsId":"PRUYOST","listingTypeName":"Residential","propertyType":"Single Family","propertySubType":"2 Story","lotSizeArea":0.2945,"lotSizeDimensions":"1/4 - 1/2 Acre","poolFeatures":"Data Unavailable","bathroomsTotal":null,"bedroomsTotal":"3","garageSpaces":null,"stories":2.00,"yearBuilt":2002,"heating":"Gas Heat","cooling":"Window Air Conditioning","interiorFeatures":null,"exteriorFeatures":"Shed","roof":"Asphalt Shingle","contactNote":"Situated on a quiet cul-de-sacdlesac in Asbury Pointe, this 3 bedoom, 2 bath home has been freshly painted and new laminate flooring recently installed.  Open layout with vaulted ceiling in living room, spacious eat in kitchen with dining area that has sliding glass doors for deck access. Partially finished lower level w/rough-in plumbing that could be used as family room/extended living space.  Newer roof, Shed & 2 car garage.","listBrokerName":"BERKSHIRE HATHAWAY HOMESALE","listBrokerPhone":"(800) 383-3535","propertyUrl":"http://www.berkshirehathawayhs.com/homesale-realty-pa305/21705506","timestampEntered":"2017-05-21T14:03:57.8796905-05:00","timestampModified":"2017-05-21T14:03:57.8796905-05:00"}],"contactEvent":{"primaryEvent":"Updated","secondaryEvents":["ExternalUpdate","Updated"]}}',
    Timestamp: '2017-05-21T19:04:00.554Z',
    SignatureVersion: '1',
    Signature: 'Y9dyuyotfott1dO0NOEQmApWVvhiuI1JWTdL2cd7yeFuh8b8LNHkTpNlOi2MK2H+WMQQD6A1iTYekstHhAI8KVnpZX0Gr9XpfQaAOWFu2zH2ol8nqyWDX4r8YOiop+4VLT+60yFKHm7noHpJ4sCgjTiTTiO9bQs/zYtr918VuCxDtS3P7qDYCBI8wEtWKo8O2tN0WU8uy2es+LQZT+9ZUZ5OiTwgA51IlKrsAnOgMeq/BhVBeHS4fEom0odkMgMa5HXOdWLcLp603jBoSQPI86ZOJrKzT4ANXCvKL/vFT/iYoY1ZeLQQ6VDXVoPXumv/gBShhy+9xkMJa+3uMxngoA==',
    SigningCertURL: 'https://sns.us-west-2.amazonaws.com/SimpleNotificationService-b95095beb82e8f6a046b3aafc7f4149a.pem',
    UnsubscribeURL: 'https://sns.us-west-2.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-west-2:228463753594:BHHS_Franchise_YoData_Queue:7b299777-20d2-491f-9f4c-48a5b092c30a',
  });

describe(`getSQSMessage`, () => {
  const url = 'https://sqs.us-west-2.amazonaws.com/746950044014/red-rdesk-queue';
  test(`returns json parsed SQS body`, async () => {
    let response = await getSQSMessage(url)
    expect(response).toHaveProperty('Type', 'Notification')
    expect(response).toHaveProperty('MessageId')
    expect(response).toHaveProperty('TopicArn')
    expect(response).toHaveProperty('Message')
    expect(response).toHaveProperty('Timestamp')
    expect(response).toHaveProperty('SignatureVersion')
    expect(response).toHaveProperty('Signature')
    expect(response).toHaveProperty('SigningCertURL')
    expect(response).toHaveProperty('UnsubscribeURL')
  });
});
