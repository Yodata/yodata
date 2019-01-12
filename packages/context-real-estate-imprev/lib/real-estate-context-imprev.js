'use strict'

const {Context} = require('@yodata/transform')

const realEstateContextImprev = Context.fromYaml(`
externalUserId: 'https://batman.example.com/profile/card#me'
source: source # need def/example
meta: meta # need example
metaOrgKeys: metaOrgKeys
orgLabel: orgLabel
status: additionalProperty.Status
localLanguage: availableLanguage.0.name
localCountry: localCountry
email: email
firstName: givenName
middleInitial: null
lastName: familyName
street1: address.0.streetAddress.0
street2: address.0.streetAddress.1
city: addressLocality
state: addressRegion
country: addressCountry
postalCode: postalCode
userImageUrl: image.url
companyId: https://example-org.dev.yodata.io/profile/card#me
officeId: https://real-estate-office.dev.yodata.io/profile/card#me
officeName: additionalProperty.officeDBA
officeUrl: null
officeEmail: null
agentProfilePage: agentProfilePage
phone1: contactPoint.telephone.0.telephone
phone1Type: contactPoint.telephone.0.name
phone2: contactPoint.telephone.1.telephone
phone2Type: contactPoint.telephone.1.name
phone3: contactPoint.telephone.2.telephone
phone3Type: contactPoint.telephone.2.name
timeZoneId: null
title: jobTitle #@example Sales Associate
license: permit.identifier
designation: designation #need definition
facebookUrl: sameAs
twitterUrl: sameAs
linkedInUrl: sameAs
`)

module.exports = realEstateContextImprev
