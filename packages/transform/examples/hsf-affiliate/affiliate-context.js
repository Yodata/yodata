module.exports = {
	'@keyOrder': [
		'type',
		'id',
		'name',
		'identifier',
		'email',
		'telephone',
		'faxNumber',
		'url'
	],
	'@default': {
		type: 'RealEstateOrganization',
		addressType: 'PostalAddress',
		ownerType: 'Person',
		parentOrganizationType: 'OrganizationRole',
		parentOrganizationRole: 'FranchiseAffiliate',
		parentOrganizationValue: 'https://hsf.ds.bhhsresource.com/profile/card#me'
	},
	addTelephone: {
		id: 'contactPoint'
	},
	AffiliateDBA: 'name',
	AffiliateFax: 'faxNumber',
	AffiliatePrimaryWebSite: 'url',
	AffiliateBusinessPhone: {
		id: 'contactPoint'
	},
	AffiliateOtherPhone: {
		id: 'contactPoint'
	},
	AffiliatePublicPhone: {
		id: 'contactPoint'
	},
	AffiliatePublicEmail: {
		id: 'contactPoint'
	},
	NonAgentCount: 'numberOfEmployees',
	NumberOfActiveOffices: 'numberOfSubOrganizations',
	AffiliateID: 'identifier.AffiliateID',
	BrokerID: 'identifier.BrokerID',
	AffiliateMLSID: 'identifier.AffiliateMLSID',
	AffiliateCountry: 'address.addressCountry',
	AffiliateCity: 'address.addressLocality',
	AffiliateState: 'address.addressRegion',
	AffiliateStreetAddress1: 'address.streetAddress',
	AffiliateStreetAddress2: 'address.streetAddress',
	AffiliateZipCode: 'address.postalCode',
	BrokerOwnerEmail: 'owner.email',
	BrokerOwnerFax: 'owner.faxNumber',
	BrokerOwnerLastName: 'owner.familyName',
	BrokerOwnerFirstName: 'owner.givenName',
	BrokerOwnerPhone: 'owner.telephone',
	FullTimeReportedCount: 'additionalProperty.FullTimeReportedCount',
	FullTimeRosterCount: 'additionalProperty.FullTimeRosterCount',
	PartTimeReportedCount: 'additionalProperty.PartTimeReportedCount',
	PartTimeRosterCount: 'additionalProperty.PartTimeRosterCount',
	FranchiseType: 'additionalProperty.FranchiseType',
	AffiliateStatus: 'additionalProperty.AffiliateStatus',
	OriginalAffiliationDate: 'parentOrganization.startDate',
	RenewalDate: 'parentOrganization.renewalDate',
	ExpirationDate: 'parentOrganization.endDate',
	MobileLeadNotificationEmail: 'additionalProperty.MobileLeadNotificationEmail',
	MobileLeadNotificationPhone: 'additionalProperty.MobileLeadNotificationPhone',
	MarketDesignationsList: {
		id: 'memberOf'
	},
	AffiliateMLSName1: {
		id: 'memberOf'
	},
	AffiliateMLSName2: {
		id: 'memberOf'
	},
	AffiliateMLSName3: {
		id: 'memberOf'
	},
	AffiliateMLSName4: {
		id: 'memberOf'
	},
	AffiliateMLSName5: {
		id: 'memberOf'
	},
	AffiliateMLSName6: {
		id: 'memberOf'
	},
	AffiliateMLSName7: {
		id: 'memberOf'
	},
	AffiliateMLSName8: {
		id: 'memberOf'
	},
	AffiliateMLSName9: {
		id: 'memberOf'
	},
	AffiliateMLSName10: {
		id: 'memberOf'
	},
	AffiliateMLSName11: {
		id: 'memberOf'
	},
	AffiliateMLSName12: {
		id: 'memberOf'
	},
	AffiliateMLSName13: {
		id: 'memberOf'
	},
	AffiliateMLSName14: {
		id: 'memberOf'
	},
	AffiliateMLSName15: {
		id: 'memberOf'
	},
	AffiliateMLSID1: null,
	AffiliateMLSID2: null,
	AffiliateMLSID3: null,
	AffiliateMLSID4: null,
	AffiliateMLSID5: null,
	AffiliateMLSID6: null,
	AffiliateMLSID7: null,
	AffiliateMLSID8: null,
	AffiliateMLSID9: null,
	AffiliateMLSID10: null,
	AffiliateMLSID11: null,
	AffiliateMLSID12: null,
	AffiliateMLSID13: null,
	AffiliateMLSID14: null,
	AffiliateMLSID15: null
}
