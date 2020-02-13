const transform = require('../..')
const data = require('./moxiworks_contact.json')

const toPerson = new transform.Context({
  '@initialValue': {
    '@context': {
      '@vocab': 'https://yodata.io/yodata/realestate#',
      moxi: 'https://yodata.io/moxiworks/contact#',
    },
    type: 'Person',
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
      name: props.value,
    }),
  },
  $job_title: 'jobTitle',
  $note: 'moxi:$note',
  $occupation: {
    key: 'hasOccupation',
    val: props => ({
      type: 'Occupation',
      name: props.value,
    }),
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
      email: props.value,
    }),
  },
  $primary_phone_number: {
    key: 'contactPoint',
    val: props => ({
      type: 'ContactPoint',
      name: 'Primary',
      telephone: props.value,
    }),
  },
  $secondary_email_address: {
    key: 'contactPoint',
    val: props => ({
      type: 'ContactPoint',
      name: 'Secondary',
      email: props.value,
    }),
  },
  $secondary_phone_number: {
    key: 'contactPoint',
    val: props => ({
      type: 'ContactPoint',
      name: 'Primary',
      telephone: props.value,
    }),
  },
})

const result = toPerson.map(data)
console.log(result)
