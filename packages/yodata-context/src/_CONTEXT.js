/**
 * Defines your local vocabulary relative to Schema.org or some other common vocabulary.
 *
 * @example - basic example
 *
 * @context: http://schema.org/ // => schema.org is my default vocabulary
 * Dude: Person  // => When I say Dude, I mean schema.org/Person
 *
 * @example - extended syntax for altering the shape of data after renaming things
 *
 * localName : {
 *    id:        {string}   - semantic identifier
 *    src?:      {string}   - key of the source (input) property
 *    dest?:     {string}   - key of the destination (output) property
 *    context?:  {Object}   - extends the root context for the current scope
 *    create?:   {Function} - returns the instance value for this name
 * }
 *
 */
import addToPath from './addToPath'
import defaultProps from './defaultProps'

const CONTEXT = {
  assignments: 'recipient',
  contactKey: addToPath('contact.identifier'),
  contactEvent: {
    key: 'type',
    val: ({ value, context }) => context.mapKey(value.primaryEvent),
  },
  originatingSystemContactKey: {
    key: 'contact.identifier',
    val: ({ value, last }) => ({
      name: last.originatingSystemName,
      value: value,
    })
  },
  originatingSystemName: null,
  namePrefix: 'contact.honorificPrefix',
  firstName: 'contact.givenName',
  middleName: addToPath('contact.additionalName'),
  lastName: 'contact.familyName',
  nameSuffix: 'contact.honorificSuffix',
  fullName: 'contact.name',
  nickname: addToPath('contact.additionalName'),
  jobTitle: 'contact.jobTitle',
  company: 'contact.worksFor',
  addresses: {
    key: 'contact.address',
    val: defaultProps({ type: 'PostalAddress' }),
  },
  addressKey: 'identifier',
  addressType: 'name',
  address1: 'streetAddress',
  address2: 'streetAddress',
  city: 'addressLocality',
  stateOrProvince: 'addressRegion',
  postalCode: 'postalCode',
  country: 'addressCountry',
  phoneNumberKey: 'identifier',
  phoneNumberType: 'name',
  phoneNumber: 'telephone',
  emailAddressKey: 'identifier',
  emailAddress: 'email',
  emailType: 'name',
  timestampEntered: 'dateCreated',
  timestampModified: 'dateModified',
  emailAddresses: {
    key: 'contact.contactPoint',
    val: defaultProps({ type: 'ContactPoint' }),
  },
  phoneNumbers: {
    key: 'contact.contactPoint',
    val: defaultProps({ type: 'ContactPoint' }),
  },
  notes: 'contact.comment',
  note: 'value',
  noteKey: 'identifier',
  addedByMember: 'author',
  ownerKey: 'identifier',
  properties: 'includes',
  leadSources: 'instrument',
  preferredContactMethod: 'contact.preferredContactMethod',
  preferredPhoneType: 'contact.preferredPhoneType',
  preferredTime: 'contact.preferredTime',
  Accepted: 'AcceptAction',
  ExternalCreate: 'AddAction',
  ExternalUpdate: 'UpdateAction',
  Created: 'AddAction',
  Assigned: 'AssignAction',
  Associated: 'AssignAction',
  AutoAccepted: 'AssignAction',
  AutoAssigned: 'AssignAction',
  AssignedToSelf: 'AssignAction',
  Deleted: 'RemoveAction',
  Registered: 'RegisterAction',
  Declined: 'RejectAction',
  LeadActivity: 'UpdateAction',
  DuplicateCreated: 'UpdateAction',
  AdminUpdate: 'UpdateAction',
  CRMSync: 'UpdateAction',
  NoteAdded: 'UpdateAction',
  Updated: 'UpdateAction',
  Retracted: 'UnAssignAction',
  Unassigned: 'UnAssignAction',
  ownerType: 'type',
  Office: () => [ 'Organization', 'RealEstateAgent' ],
  Member: () => [ 'Person', 'RealEstateAgent' ],
};

export default CONTEXT;
