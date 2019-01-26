const MOCK_EVENT = {
	contactEvent: {
		primaryEvent: 'Updated',
		secondaryEvents: ['ExternalUpdate', 'Updated']
	},
	contactKey: '_contactKey',
	originatingSystemContactKey: '_originatingSystemContactKey',
	originatingSystemName: 'BrokerOffice',
	namePrefix: '_namePrefix',
	firstName: '_firstName',
	middleName: '_middleName',
	lastName: '_lastName',
	nameSuffix: '_nameSuffix',
	fullName: '_fullName',
	nickname: '_nickname',
	jobTitle: '_jobTitle',
	company: '_company',
	preferredContactMethod: '_preferredContactMethod',
	preferredPhoneType: '_preferredPhoneType',
	preferredTime: '_preferredTime',
	timestampEntered: '2017-05-21T14:03:57.8796905-05:00',
	timestampModified: '2017-05-21T14:03:57.8796905-05:00',
	addresses: [
		{
			addressKey: '_addressKey',
			addressType: '_addressType',
			address1: '_address1',
			address2: '_address2',
			city: '_city',
			stateOrProvince: '_stateOrProvince',
			postalCode: '_postalCode',
			country: '_country',
			timestampEntered: '2017-05-24T20:16:12.8419099-05:00',
			timestampModified: '2017-05-24T20:16:12.8419099-05:00'
		}
	],
	emailAddresses: [
		{
			emailAddressKey: '_emailAddressKey',
			emailAddress: '_emailAddress',
			emailType: '_emailType',
			usedForApm: true,
			timestampEntered: '2017-05-21T14:03:57.8640648-05:00',
			timestampModified: '2017-05-21T14:03:57.957819-05:00'
		}
	],
	phoneNumbers: [
		{
			phoneNumberKey: '_homePhoneNumberKey',
			phoneNumberType: 'Home',
			phoneNumber: '_homePhoneNumber',
			timestampEntered: '2017-05-21T14:03:57.8640648-05:00',
			timestampModified: '2017-05-21T14:03:57.957819-05:00'
		},
		{
			phoneNumberKey: '_workPhoneNumberKey',
			phoneNumberType: 'Work',
			phoneNumber: '_workPhoneNumber',
			timestampEntered: '2017-05-21T14:03:57.8640648-05:00',
			timestampModified: '2017-05-21T14:03:57.957819-05:00'
		}
	],
	acceptedByMember: true,
	assignments: [
		{
			ownerType: 'Office',
			ownerKey: 'C90059FD64E6403E9C9A7BE7AAA60C82',
			autoAccept: false,
			assignmentType: '_assignmentType',
			timestampEntered: '2017-05-21T14:03:57.8796905-05:00'
		},
		{
			ownerType: 'Member',
			ownerKey: '_ownerKey',
			autoAccept: false,
			assignmentType: '_assignmentType',
			timestampEntered: '2017-05-21T14:03:57.8796905-05:00'
		}
	],
	notes: [
		{
			noteKey: '_noteKey',
			addedByMember: '_addedByMember',
			note: '_note',
			timestampEntered: '2017-05-24T12:09:45'
		}
	],
	leadSources: [
		{
			leadSource: '_leadSource',
			subLeadSource: '_subLeadSource',
			originalReferrerUrl: '_originalReferrerUrl',
			isLead: true,
			timestampEntered: '2017-05-21T14:03:57.8796905-05:00'
		}
	],
	properties: [
		{
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
			city: 'Mount Wolf',
			stateOrProvince: 'PA',
			postalCode: '17347',
			country: 'USA',
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
			timestampEntered: '2017-05-21T14:03:57.8796905-05:00',
			timestampModified: '2017-05-21T14:03:57.8796905-05:00'
		}
	]
}
const createEvent = eventType => {
	return {...MOCK_EVENT, contactEvent: {primaryEvent: eventType}}
}

const RED_CONTACT_EVENT = createEvent('Updated')
const SNS_NOTIFICATION = {
	Type: 'Notification',
	Timestamp: '2017-12-12T08:35:19.976Z',
	TopicArn: 'arn:aws:sns:aws-region:aws-account:topic-name',
	MessageId: 'notification-message-id',
	Message: JSON.stringify(RED_CONTACT_EVENT)
}
const SQS_MESSAGE = {
	MessageId: 'sqs-message-id',
	Body: JSON.stringify(SNS_NOTIFICATION)
}
const OFFICE_LEAD = {
	acceptedByMember: false,
	assignments: [
		{
			assignmentType: 'Lead',
			ownerKey: 'C90059FD64E6403E9C9A7BE7AAA60C82',
			ownerType: 'Office',
			timestampEntered: '2017-04-22T14:40:46.0775524-05:00'
		}
	],
	contactEvent: {
		primaryEvent: 'Updated',
		secondaryEvents: [
			'ExternalUpdate',
			'Updated'
		]
	},
	contactKey: '80803473-7ddb-4fdc-be55-b29d642c7a5e',
	emailAddresses: [
		{
			emailAddress: 'jennifer.kowitt@gmail.com',
			emailAddressKey: '73881931-3e28-495f-ac05-f800adb559ec',
			emailType: 'primary',
			timestampEntered: '2017-04-22T14:40:46.0775524-05:00',
			timestampModified: '2017-04-22T14:40:46.1556819-05:00',
			usedForApm: true
		}
	],
	firstName: 'Jennifer',
	fullName: 'Jennifer Kowitt',
	lastName: 'Kowitt',
	leadSources: [
		{
			isLead: true,
			leadSource: 'Office Website',
			originalReferrerUrl: '',
			subLeadSource: 'Saved Property',
			timestampEntered: '2017-04-22T14:40:46.0775524-05:00'
		}
	],
	middleName: '',
	originatingSystemContactKey: '',
	originatingSystemName: 'BrokerOffice',
	phoneNumbers: [
		{
			phoneNumber: '9084192418',
			phoneNumberKey: '7f375a61-778c-4c1b-9f6b-e1d63a19334f',
			phoneNumberType: 'Work',
			timestampEntered: '2017-04-22T14:40:46.0775524-05:00',
			timestampModified: '2017-04-22T14:40:46.1556819-05:00'
		}
	],
	preferredContactMethod: 'No Preference',
	preferredTime: '',
	properties: [
		{
			bathroomsTotal: '3',
			bedroomsTotal: '4',
			city: 'W Hartford',
			contactNote: 'Convenient location to West Hartford Center, schools, Stop & Shop and the Mall.  Meticulous Tudor Colonial with 2460 square feet.  Outstanding family home featuring renovated baths and ESK kitchen with SS appliances plus a den/office, lovely formal LR/FP and elegant DR, plus a 24 x 9 sunroom. Enjoy the LL Rec Rm (406 Sq. Ft/FP) and the 3rd Floor bonus room (420 Sq. Ft) in addition to 4 Bedrooms and 2.1 Baths. A/C in kitchen only and throughout the second floor. You will appreciate your deck (404 Sq. Ft) as you view and enjoy the tranquility of your professionally landscaped yard with perennials popping up all around.    This home is a pleasure to present to you.',
			cooling: 'Central Air',
			country: 'USA',
			countyOrParish: 'Hartford',
			daysOnMarket: 5,
			directions: 'Farmington Ave to Ridgewood Road',
			exteriorFeatures: 'Fruit Trees, Garden, Gutters, Exterior Lighting, Sidewalks, Landscaped',
			heating: 'Gas Heat',
			interiorFeatures: 'Attic Storage, Attic Walk-up, Smoke Alarm',
			listAgentEmail: 'hsteel@bhhsne.com',
			listAgentFirstName: 'Hannah',
			listAgentFullName: 'Hannah Steel',
			listAgentLastName: 'Steel',
			listAgentMlsId: 'STEELH',
			listAor: 'ctconnmls',
			listBrokerName: 'BHHS New England Properties',
			listBrokerPhone: '(860) 521-8100',
			listOfficeMlsId: 'BHHS04',
			listPrice: 545000,
			listingContractDate: '2017-04-17T16:03:00',
			listingId: 'G10212776',
			listingKey: '5e4afc46-cd62-4422-a058-b27a1a57451b',
			listingTypeName: 'Residential',
			lotSizeArea: 0.27,
			mlsStatus: 'Active',
			poolFeatures: 'Pool',
			postalCode: '06107',
			propertySubType: 'Colonial',
			propertyType: 'Single Family',
			propertyUrl: 'http://www.berkshirehathawayhs.com/new-england-properties-ct301/G10212776',
			stateOrProvince: 'CT',
			streetName: 'Ridgewood Rd',
			streetNumber: '50',
			streetNumberNumeric: 50,
			subdivisionName: 'W Hartford (2)',
			timestampEntered: '2017-04-22T14:40:46.0775524-05:00',
			timestampModified: '2017-04-22T14:40:46.0775524-05:00',
			yearBuilt: 1939
		}
	],
	timestampEntered: '2017-04-22T14:40:46.0775524-05:00',
	timestampModified: '2017-04-22T14:40:46.0775524-05:00'
}
const TRANSFORMED_CONTACT_EVENT = {
	type: 'UpdateAction',
	contact: {
		identifier: ['_contactKey',
			{name: 'BrokerOffice', value: '_originatingSystemContactKey'}],
		honorificPrefix: '_namePrefix',
		givenName: '_firstName',
		additionalName: ['_middleName', '_nickname'],
		familyName: '_lastName',
		honorificSuffix: '_nameSuffix',
		name: '_fullName',
		jobTitle: '_jobTitle',
		worksFor: '_company',
		preferredContactMethod: '_preferredContactMethod',
		preferredPhoneType: '_preferredPhoneType',
		preferredTime: '_preferredTime',
		address: [{
			type: 'PostalAddress',
			identifier: '_addressKey',
			name: '_addressType',
			streetAddress: ['_address1', '_address2'],
			addressLocality: '_city',
			addressRegion: '_stateOrProvince',
			postalCode: '_postalCode',
			addressCountry: '_country',
			dateCreated: '2017-05-24T20:16:12.8419099-05:00',
			dateModified: '2017-05-24T20:16:12.8419099-05:00'
		}],
		contactPoint: [{
			type: 'ContactPoint',
			identifier: '_emailAddressKey',
			email: '_emailAddress',
			name: '_emailType',
			usedForApm: true,
			dateCreated: '2017-05-21T14:03:57.8640648-05:00',
			dateModified: '2017-05-21T14:03:57.957819-05:00'
		}],
		comment: [{
			type: 'Comment',
			identifier: '_noteKey',
			author: '_addedByMember',
			value: '_note',
			dateCreated: '2017-05-24T12:09:45'
		}],
		homeLocation: [{
			type: 'ContactPoint',
			identifier: '_homePhoneNumberKey',
			name: 'Home',
			telephone: '_homePhoneNumber',
			dateCreated: '2017-05-21T14:03:57.8640648-05:00',
			dateModified: '2017-05-21T14:03:57.957819-05:00'
		}],
		workLocation: [{
			type: 'ContactPoint',
			identifier: '_workPhoneNumberKey',
			name: 'Work',
			telephone: '_workPhoneNumber',
			dateCreated: '2017-05-21T14:03:57.8640648-05:00',
			dateModified: '2017-05-21T14:03:57.957819-05:00'
		}]
	},
	dateCreated: '2017-05-21T14:03:57.8796905-05:00',
	dateModified: '2017-05-21T14:03:57.8796905-05:00',
	acceptedByMember: true,
	recipient: [{
		type: 'Organization',
		identifier: 'C90059FD64E6403E9C9A7BE7AAA60C82',
		memberOf: {identifier: '84D352FB748843A189200CE9B1C3E618'},
		id: 'https://ct301.ds.bhhsresource.com/profile/card#me',
		originatingSystemName: 'Berkshire Hathaway HomeServices',
		name: 'Berkshire Hathaway HomeServices New England Properties',
		telephone: '(855) 295-8440',
		faxNumber: '(860) 571-6904',
		email: 'clientservices@bhhsne.com',
		officeBranchType: 'Broker',
		officeAor: 'ctgreenw-v',
		officeAorMlsID: 'ctgreenw-v',
		officeBrokerMlsID: 'CTGREENW-CT301',
		address:
                           {
                           	streetAddress: '860 N. Main St.',
                           	addressLocality: 'Wallingford',
                           	addressRegion: 'CT',
                           	postalCode: '06492'
                           },
		timestampEntered: '2013-09-17T21:04:26.19Z',
		timestampModified: '2018-01-22T16:55:54.303Z'
	},
	{
		type: 'Person',
		identifier: '_ownerKey',
		autoAccept: false,
		assignmentType: '_assignmentType',
		dateCreated: '2017-05-21T14:03:57.8796905-05:00'
	}],
	instrument: [{
		leadSource: '_leadSource',
		subLeadSource: '_subLeadSource',
		originalReferrerUrl: '_originalReferrerUrl',
		isLead: true,
		dateCreated: '2017-05-21T14:03:57.8796905-05:00'
	}],
	includes: [{
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
		dateModified: '2017-05-21T14:03:57.8796905-05:00'
	}]
}
const GET_MEMBER_RESPONSE = {
	memberKey: 'D505D16BD9624A19B8A03D97AEABA8E2',
	originatingSystemMemberKey: '460219',
	originatingSystemName: 'Berkshire Hathaway HomeServices',
	memberMlsId: 'ALLEECO-V',
	memberFirstName: 'Alice',
	memberLastName: 'Nelson',
	memberFullName: 'Alice Nelson',
	memberEmail: 'alice@alicenelsonauburn.com',
	memberPreferredPhone: '(334) 826-1010',
	memberMobilePhone: '(334) 332-5022',
	memberFax: '(334) 826-1049',
	memberAor: 'ALLEECO-V',
	memberAorMlsId: '177212',
	memberAddress1: '1810 E. Glenn Ave. Ste. 130',
	memberCity: 'Auburn',
	memberStateOrProvince: 'AL',
	memberPostalCode: '36830',
	memberResponseOMeterScore: 66.67,
	memberFollowupOMeterScore: 0,
	officeKey: '0905D4F2EB5B4AB8AA79DF9149449EAA',
	timestampEntered: '2015-03-05T18:00:21.337Z',
	timestampModified: '2018-01-16T07:56:54.58Z'
}
const GET_OFFICE_RESPONSE = {
	officeKey: '3E3A2109315547188A5DCBDABFCDDCC0',
	mainOfficeKey: '84D352FB748843A189200CE9B1C3E618',
	originatingSystemOfficeKey: 'PA305',
	originatingSystemName: 'Berkshire Hathaway HomeServices',
	officeName: 'Berkshire Hathaway HomeServices Homesale Realty',
	officePhone: '(800) 383-3535',
	officeFax: '(717) 393-5298',
	officeEmail: 'cam@homesale.com',
	officeBranchType: 'Broker',
	officeAor: 'paschuyk-v',
	officeAorMlsID: 'paschuyk-v',
	officeBrokerMlsID: 'PASCHUYK-PA305',
	officeAddress1: '215 S. Centerville Rd. Ste. B',
	officeCity: 'Lancaster',
	officeStateOrProvince: 'PA',
	officePostalCode: '17603',
	timestampEntered: '2014-05-21T22:43:52.893Z',
	timestampModified: '2018-01-24T14:54:27.357Z'
}
const exampleEvent = {
	Updated: {
		contactEvent: {
			primaryEvent: 'Updated',
			secondaryEvents: ['ExternalUpdate', 'Updated']
		},
		contactKey: '_contactKey',
		originatingSystemContactKey: '_originatingSystemContactKey',
		originatingSystemName: 'BrokerOffice',
		namePrefix: '_namePrefix',
		firstName: '_firstName',
		middleName: '_middleName',
		lastName: '_lastName',
		nameSuffix: '_nameSuffix',
		fullName: '_fullName',
		nickname: '_nickname',
		jobTitle: '_jobTitle',
		company: '_company',
		preferredContactMethod: '_preferredContactMethod',
		preferredPhoneType: '_preferredPhoneType',
		preferredTime: '_preferredTime',
		timestampEntered: '2017-05-21T14:03:57.8796905-05:00',
		timestampModified: '2017-05-21T14:03:57.8796905-05:00',
		addresses: [
			{
				addressKey: '_addressKey',
				addressType: '_addressType',
				address1: '_address1',
				address2: '_address2',
				city: '_city',
				stateOrProvince: '_stateOrProvince',
				postalCode: '_postalCode',
				country: '_country',
				timestampEntered: '2017-05-24T20:16:12.8419099-05:00',
				timestampModified: '2017-05-24T20:16:12.8419099-05:00'
			}
		],
		emailAddresses: [
			{
				emailAddressKey: '_emailAddressKey',
				emailAddress: '_emailAddress',
				emailType: '_emailType',
				usedForApm: true,
				timestampEntered: '2017-05-21T14:03:57.8640648-05:00',
				timestampModified: '2017-05-21T14:03:57.957819-05:00'
			}
		],
		phoneNumbers: [
			{
				phoneNumberKey: '_phoneNumberKey',
				phoneNumberType: '_phoneNumberType',
				phoneNumber: '_phoneNumber',
				timestampEntered: '2017-05-21T14:03:57.8640648-05:00',
				timestampModified: '2017-05-21T14:03:57.957819-05:00'
			}
		],
		acceptedByMember: true,
		assignments: [
			{
				ownerType: 'Office',
				ownerKey: '_ownerKey',
				autoAccept: false,
				assignmentType: '_assignmentType',
				timestampEntered: '2017-05-21T14:03:57.8796905-05:00'
			},
			{
				ownerType: 'Member',
				ownerKey: '_ownerKey',
				autoAccept: false,
				assignmentType: '_assignmentType',
				timestampEntered: '2017-05-21T14:03:57.8796905-05:00'
			}
		],
		notes: [
			{
				noteKey: '_noteKey',
				addedByMember: '_addedByMember',
				note: '_note',
				timestampEntered: '2017-05-24T12:09:45'
			}
		],
		leadSources: [
			{
				leadSource: '_leadSource',
				subLeadSource: '_subLeadSource',
				originalReferrerUrl: '_originalReferrerUrl',
				isLead: true,
				timestampEntered: '2017-05-21T14:03:57.8796905-05:00'
			}
		],
		properties: [
			{
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
				city: 'Mount Wolf',
				stateOrProvince: 'PA',
				postalCode: '17347',
				country: 'USA',
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
				timestampEntered: '2017-05-21T14:03:57.8796905-05:00',
				timestampModified: '2017-05-21T14:03:57.8796905-05:00'
			}
		]
	},
	Created: {
		contactKey: 'fef6cd63-d9a6-4eff-80c0-1c335c5cb701',
		originatingSystemContactKey: '',
		originatingSystemName: 'BrokerOffice',
		namePrefix: null,
		firstName: 'j',
		middleName: '',
		lastName: 'scott',
		nameSuffix: null,
		fullName: 'j scott',
		nickname: null,
		jobTitle: null,
		company: null,
		acceptedByMember: true,
		preferredContactMethod: 'No Preference',
		preferredPhoneType: null,
		preferredTime: '',
		timestampEntered: '2017-06-04T17:01:10.2226168-05:00',
		timestampModified: '2017-06-04T17:01:10.2226168-05:00',
		addresses: [],
		emailAddresses: [{
			emailAddressKey: 'e62e5ab1-7cd6-4351-85f6-b579577fa90f',
			emailAddress: 'primaryEmailAddress',
			emailType: 'primary',
			usedForApm: true,
			timestampEntered: '2017-06-04T17:01:11.747',
			timestampModified: '2017-06-04T17:01:11.747'
		}],
		phoneNumbers: [
			{
				phoneNumberKey: '78378143-9591-4606-a503-52674185ef31',
				phoneNumberType: 'Work',
				phoneNumber: 'workPhoneNumber',
				timestampEntered: '2017-06-04T17:01:10.2226168-05:00',
				timestampModified: '2017-06-04T17:01:13.0196171-05:00'
			},
			{
				phoneNumberKey: '78378143-9591-4606-a503-52674185ef31',
				phoneNumberType: 'Home',
				phoneNumber: 'homePhoneNumber',
				timestampEntered: '2017-06-04T17:01:10.2226168-05:00',
				timestampModified: '2017-06-04T17:01:13.0196171-05:00'
			}
		],
		assignments: [{
			ownerType: 'Office',
			ownerKey: 'office-id',
			autoAccept: null,
			assignmentType: 'Lead',
			timestampEntered: '2017-06-04T17:01:10.2226168-05:00'
		}],
		notes: [{
			noteKey: '0b8d270f-193e-4278-b73a-212d6d8c4475',
			addedByMember: '',
			note: 'ClientRegistration: j scott\n\nI\'m interested in buying a home: \nI\'m interested in buying a home in the following areas: n/a\nI would like to sell my home: ',
			timestampEntered: '2017-06-04T15:01:12'
		}],
		leadSources: [{
			leadSource: 'Office Website',
			subLeadSource: 'Inside Access',
			originalReferrerUrl: 'https://www.google.com/',
			isLead: true,
			timestampEntered: '2017-06-04T17:01:10.2226168-05:00'
		}],
		properties: null,
		contactEvent: {
			primaryEvent: 'Created',
			secondaryEvents: ['ExternalCreate', 'Created', 'Created', 'Created']
		}
	},
	Assigned: {
		contactKey: 'c9dc5487-87a1-496a-bac3-ad15427e17e3',
		originatingSystemContactKey: '',
		originatingSystemName: 'BrokerOffice',
		namePrefix: null,
		firstName: 'Kay',
		middleName: null,
		lastName: 'Byers',
		nameSuffix: null,
		fullName: 'Kay Byers',
		nickname: null,
		jobTitle: null,
		company: null,
		acceptedByMember: false,
		preferredContactMethod: 'No Preference',
		preferredPhoneType: 'No preference',
		preferredTime: null,
		timestampEntered: '2017-06-04T05:31:42.74',
		timestampModified: '2017-06-04T05:36:41.103',
		addresses: [],
		emailAddresses: [{
			emailAddressKey: 'f92d8f47-69d0-4e5f-a776-27a5e05a5aa2',
			emailAddress: 'Kayleebye@aol.com',
			emailType: 'primary',
			usedForApm: true,
			timestampEntered: '2017-06-04T05:31:49.593',
			timestampModified: '2017-06-04T05:31:49.593'
		}],
		phoneNumbers: [{
			phoneNumberKey: '5163df37-fbea-4b33-9fbb-775b026f8e76',
			phoneNumberType: 'Work',
			phoneNumber: '7173334816',
			timestampEntered: '2017-06-04T05:31:49.053',
			timestampModified: '2017-06-04T05:31:49.053'
		}],
		assignments: [{
			ownerType: 'Member',
			ownerKey: 'F9013AE82D574AE7A201994235FE2CCC',
			autoAccept: false,
			assignmentType: 'Lead',
			timestampEntered: '2017-06-04T05:31:42.74'
		}],
		notes: [{
			noteKey: '1c40fa3c-f723-4194-8c2f-09db05d63a60',
			addedByMember: 'Cathy Jenkins',
			note: 'CJ SET Saved Search\nCCD RANDOM Lead - 25% ref fee AA JESSE HERSH ',
			timestampEntered: '2017-06-07T15:24:38.013'
		}],
		leadSources: null,
		properties: [{
			listingKey: 'cd9f389c-20b9-46c1-9cdb-1edab5cc15e8',
			listingId: '265768',
			listAor: 'paksml-v',
			mlsStatus: null,
			listingContractDate: null,
			daysOnMarket: 0,
			listPrice: 244900,
			streetNumber: null,
			streetNumberNumeric: null,
			streetDirPrefix: null,
			streetName: '43 Orchard  Road',
			streetSuffix: null,
			unitNumber: '',
			city: 'Lancaster',
			stateOrProvince: 'PA',
			postalCode: '17601',
			country: null,
			countyOrParish: null,
			subdivisionName: null,
			directions: null,
			listAgentFirstName: null,
			listAgentLastName: null,
			listAgentFullName: null,
			listAgentEmail: null,
			listAgentMlsId: null,
			listOfficeMlsId: null,
			listingTypeName: 'Residential',
			propertyType: null,
			propertySubType: null,
			lotSizeArea: null,
			lotSizeDimensions: null,
			poolFeatures: null,
			bathroomsTotal: '2',
			bedroomsTotal: '4',
			garageSpaces: null,
			stories: 1,
			yearBuilt: 1954,
			heating: null,
			cooling: null,
			interiorFeatures: null,
			exteriorFeatures: null,
			roof: null,
			contactNote: null,
			listBrokerName: null,
			listBrokerPhone: null,
			propertyUrl: 'http://www.berkshirehathawayhs.com/265768',
			timestampEntered: '2017-06-04T05:31:42.74',
			timestampModified: '2017-06-04T05:36:41.103'
		}],
		contactEvent: {primaryEvent: 'Assigned', secondaryEvents: ['Assigned']}
	},
	AssignedToSelf: {
		contactKey: 'a21d61fe-4845-4430-afd6-d80473803a7f',
		originatingSystemContactKey: '',
		originatingSystemName: 'BrokerOffice',
		namePrefix: null,
		firstName: 'Sean',
		middleName: '',
		lastName: 'Healy',
		nameSuffix: null,
		fullName: 'Sean Healy',
		nickname: null,
		jobTitle: null,
		company: null,
		acceptedByMember: true,
		preferredContactMethod: 'Email',
		preferredPhoneType: 'No Preference',
		preferredTime: 'No Preference',
		timestampEntered: '2006-05-23T11:23:19.057',
		timestampModified: '2014-06-25T00:19:07.78',
		addresses:
                                 [{
                                 	addressKey: '5b3e07a3-eeba-4d60-a02a-ab78bbf2c89f',
                                 	addressType: 'home',
                                 	address1: '',
                                 	address2: '',
                                 	city: 'Tarrifville',
                                 	stateOrProvince: 'CT',
                                 	postalCode: '',
                                 	country: '',
                                 	timestampEntered: '2006-05-23T11:23:19.057',
                                 	timestampModified: '2014-06-25T00:19:07.78'
                                 }],
		emailAddresses:
                                 [{
                                 	emailAddressKey: '089e81ab-f458-4a3d-90af-1fbf19cec25b',
                                 	emailAddress: 'shealss@yahoo.com',
                                 	emailType: 'primary',
                                 	usedForApm: true,
                                 	timestampEntered: '2006-05-23T11:23:19.057',
                                 	timestampModified: '2013-09-26T00:17:07.64'
                                 }],
		phoneNumbers:
                                 [{
                                 	phoneNumberKey: '580de149-55ad-4fdf-a7ce-9653ffeaca82',
                                 	phoneNumberType: 'Home',
                                 	phoneNumber: '(860) 913-5155',
                                 	timestampEntered: '2006-05-23T11:23:19.057',
                                 	timestampModified: '2017-06-09T10:55:59.943645-05:00'
                                 }],
		assignments:
                                 [{
                                 	ownerType: 'Member',
                                 	ownerKey: 'A23DCDDAA62E49FDBB5619D5569C2EDF',
                                 	autoAccept: false,
                                 	assignmentType: 'Lead',
                                 	timestampEntered: '2006-05-23T11:23:19.057'
                                 }],
		notes:
                                 [{
                                 	noteKey: '278a384a-85b2-4cbe-8a1f-3514d3dc7b92',
                                 	addedByMember: '',
                                 	note: 'Please do not contact me I am only viewing this house. I already have a real estate agent with Century 21.',
                                 	timestampEntered: '2006-05-23T11:23:19.057'
                                 }],
		leadSources: null,
		properties: null,
		contactEvent:
                                 {
                                 	primaryEvent: 'AssignedToSelf',
                                 	secondaryEvents:
                                                 ['Registered',
                                                 	'Updated',
                                                 	'AutoAssigned',
                                                 	'AssignedToSelf',
                                                 	'AutoAccepted']
                                 }
	}
}

module.exports = {
	MOCK_EVENT,
	RED_CONTACT_EVENT,
	SNS_NOTIFICATION,
	SQS_MESSAGE,
	OFFICE_LEAD,
	TRANSFORMED_CONTACT_EVENT,
	createEvent,
	exampleEvent,
	GET_MEMBER_RESPONSE,
	GET_OFFICE_RESPONSE
}
