import test from 'ava'

const expect = require('expect')
const transform = require('..')

test('define a transformation', t => {
	const youHave = {
		$moxi_works_agent_id: 'agent_id',
		$partner_contact_id: 'contact_id',
		$contact_name: 'Bruce Wayne',
		$gender: 'male',
		$home_street_address: '1007 Mountain Drive',
		$home_city: 'Gotham City',
		$home_state: 'NJ',
		$home_zip: '10001',
		$home_neighborhood: 'Gotham',
		$home_country: 'US',
		$job_title: 'Caped Crusader',
		$note: 'I\'m batman',
		$occupation: 'Super Hero',
		$is_new_contact: false,
		$birthday: '1939-05-27',
		$anniversary: '1961-05-23',
		$home_purchase_anniversary: '1999-01-01',
		$social_media_profiles: ['https://en.wikipedia.org/wiki/Batman'],
		$partner_agent_id: 'partner_agent_id',
		$primary_email_address: 'batman@example.com',
		$primary_phone_number: '867-5309',
		$secondary_email_address: 'bruce.wayne@example.com',
		$secondary_phone_number: '555-1212'
	}
	const youWant = {
		'@context': {
			'@vocab': 'https://yodata.io/yodata/realestate#',
			moxi: 'https://yodata.io/moxiworks/contact#'
		},
		type: 'Person',
		'moxi:$moxi_works_agent_id': 'agent_id',
		'moxi:$partner_contact_id': 'contact_id',
		name: 'Bruce Wayne',
		gender: 'male',
		address: [
			{
				type: 'PostalAddress',
				streetAddress: '1007 Mountain Drive',
				addressLocality: 'Gotham City',
				addressRegion: 'NJ',
				postalCode: '10001',
				addressCountry: 'US'
			},
			{
				type: 'Place',
				name: 'Gotham'
			}
		],
		jobTitle: 'Caped Crusader',
		'moxi:$note': 'I\'m batman',
		hasOccupation: {
			type: 'Occupation',
			name: 'Super Hero'
		},
		birthDate: '1939-05-27',
		'moxi:$is_new_contact': false,
		'moxi:$home_purchase_anniversary': '1999-01-01',
		'moxi:$anniversary': '1961-05-23',
		'moxi:$partner_agent_id': 'partner_agent_id',
		url: ['https://en.wikipedia.org/wiki/Batman'],
		contactPoint: [
			{
				type: 'ContactPoint',
				name: 'Primary',
				email: 'batman@example.com'
			},
			{
				type: 'ContactPoint',
				name: 'Primary',
				telephone: '867-5309'
			},
			{
				type: 'ContactPoint',
				name: 'Secondary',
				telephone: '555-1212'
			},
			{
				type: 'ContactPoint',
				name: 'Secondary',
				email: 'bruce.wayne@example.com'
			}
		]
	}
	const context = new transform.Context({
		'@initialValue': {
			'@context': {
				'@vocab': 'https://yodata.io/yodata/realestate#',
				moxi: 'https://yodata.io/moxiworks/contact#'
			},
			type: 'Person'
		},
		$moxi_works_agent_id: 'moxi:$moxi_works_agent_id',
		$partner_contact_id: 'moxi:$partner_contact_id',
		$contact_name: 'name',
		$gender: 'gender',
		$home_street_address: 'address.0.streetAddress',
		$home_city: 'address.0.addressLocality',
		$home_state: 'address.0.addressRegion',
		$home_zip: 'address.0.postalCode',
		$home_country: 'address.0.addressCountry',
		$home_neighborhood: {
			key: 'address',
			val: props => ({
				type: 'Place',
				name: props.value
			})
		},
		$job_title: 'jobTitle',
		$note: 'moxi:$note',
		$occupation: {
			key: 'hasOccupation',
			val: props => ({
				type: 'Occupation',
				name: props.value
			})
		},
		$is_new_contact: 'moxi:$is_new_contact',
		$birthday: 'birthDate',
		$anniversary: 'moxi:$anniversary',
		$home_purchase_anniversary: 'moxi:$home_purchase_anniversary',
		$social_media_profiles: 'url',
		$partner_agent_id: 'moxi:$partner_agent_id',
		$primary_email_address: {
			key: 'contactPoint',
			val: props => ({
				type: 'ContactPoint',
				name: 'Primary',
				email: props.value
			})
		},
		$primary_phone_number: {
			key: 'contactPoint',
			val: props => ({
				type: 'ContactPoint',
				name: 'Primary',
				telephone: props.value
			})
		},
		$secondary_email_address: {
			key: 'contactPoint',
			val: props => ({
				type: 'ContactPoint',
				name: 'Secondary',
				email: props.value
			})
		},
		$secondary_phone_number: {
			key: 'contactPoint',
			val: props => ({
				type: 'ContactPoint',
				name: 'Primary',
				telephone: props.value
			})
		}
	})
	expect(context.map(youHave)).toEqual(youWant)
	t.pass()
})
