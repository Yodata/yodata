const pd = require('./process-data')

test('fixsuborg', () => {
  let suborgs = [
    'https://333740.bhhs.hsfaffiliates.com/profile/card',
    'https://333740.bhhs.hsfaffiliates.com/profile/card',
    'https://333741.bhhs.hsfaffiliates.com/profile/card',
  ]
  let result = pd.fixSubOrgIds(suborgs)
  expect(result).toHaveLength(2)
  expect(result).toContain('https://333740.bhhs.hsfaffiliates.com/profile/card#me')
  expect(result).toContain('https://333741.bhhs.hsfaffiliates.com/profile/card#me')
})

test('processprofile', () => {
  const profile = {
    id: 'https://DAVE.yodata.me/profile/card#me',
    parentOrganization: ['https://mom.com/profile/card#me'],
    subOrganization: ['https://kida.io/profile/card', 'https://KIDA.io/profile/card#me'],
  }
  const result = pd.processProfileData(profile)
  expect(result).toHaveProperty('id', 'https://dave.yodata.me/profile/card#me')
  expect(result).toHaveProperty('parentOrganization')
  expect(result.parentOrganization).toHaveLength(1)
  expect(result.subOrganization).toContain('https://kida.io/profile/card#me')
})

test('uppercaseit', () => {
  const profile = {
    id: 'https://dave.yodata.me/profile/card',
    type: 'RealEstateOrganization',
    identifier: {
      AffiliateID: 'a',
      BrokerID: 'b',
      OfficeID: 'c',
    },
  }
  const result = pd.processProfileData(profile)
  expect(result).toHaveProperty('id', 'https://dave.yodata.me/profile/card#me')
  expect(result).toHaveProperty('identifier.AffiliateID', 'A')
  expect(result).toHaveProperty('identifier.BrokerID', 'B')
  expect(result).toHaveProperty('identifier.OfficeID', 'C')
})
