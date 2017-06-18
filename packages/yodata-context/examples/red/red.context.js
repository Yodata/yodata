import { defaultProps } from '../../src/helpers'
import Context  from '../../src/context';

const context = new Context({
  // contactEvent maps to a specific ActionType
  // some events have been consolidated to keep within
  // schema.org defined Action types, see sub-context for details
  contactEvent: {
    key: 'type',
    val: ({ value: { primaryEvent } }) => primaryEvent,
    context: {
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
    },
  },
  contactKey: 'contact.identifier',
  originatingSystemContactKey: {
    key: 'contact.identifier',
    val: ({ value, last }) => ({
      name: last.originatingSystemName,
      value: value,
    }),
  },
  originatingSystemName: null,
  fullName: 'contact.name',
  firstName: 'contact.givenName',
  lastName: 'contact.familyName',
  namePrefix: 'contact.honorificPrefix',
  nameSuffix: 'contact.honorificSuffix',
  middleName: 'contact.additionalName',
  nickname: 'contact.additionalName',
  jobTitle: 'contact.jobTitle',
  company: 'contact.worksFor',

  addresses: {
    key: 'contact.address',
    val: defaultProps({ type: 'PostalAddress' }),
    context: {
      addressKey: 'identifier',
      addressType: 'name',
      address1: 'streetAddress',
      address2: 'streetAddress',
      city: 'addressLocality',
      stateOrProvince: 'addressRegion',
      postalCode: 'postalCode',
      country: 'addressCountry',
    },
  },
  emailAddresses: {
    key: 'contact.contactPoint',
    val: defaultProps({ type: 'ContactPoint' }),
    context: {
      emailAddressKey: 'identifier',
      emailAddress: 'email',
      emailType: 'name',
    },
  },
  phoneNumbers: {
    key: 'contact.contactPoint',
    val: defaultProps({ type: 'ContactPoint' }),
    context: {
      phoneNumberKey: 'identifier',
      phoneNumberType: 'name',
      phoneNumber: 'telephone',
    },
  },

  preferredContactMethod: 'contact.preferredContactMethod',
  preferredPhoneType: 'contact.preferredPhoneType',
  preferredTime: 'contact.preferredTime',

  // lead assignment maps to Action.recipient prop.
  // owner types Office and Member map to compound schema types
  // because RealEstateAgent is a business classification,
  // indicating that the entity, either a Person or an Organization,
  // offers real estate services.
  assignments: {
    key: 'recipient',
    context: {
      ownerType: 'type',
      Office: () => [ 'Organization', 'RealEstateAgent' ],
      Member: () => [ 'Person', 'RealEstateAgent' ],
      ownerKey: 'identifier',
    }
  },

  notes: {
    key: 'contact.comment',
    val: defaultProps({
      type: 'Comment'
    }),
    context: {
      noteKey: 'identifier',
      note: 'value',
      addedByMember: 'author',
    },
  },

  // lead source maps to Action.instrument, which is some entity
  // that helps the Action.agent (actor) complete the action
  // i.e. "the website is an instrument in the statement:
  // "Bob sent Alice a message from her website"
  leadSources: 'instrument',

  // includes is a generic container for passing data
  // related to the entities mentioned in the action,
  // not directly included in root Action event.
  properties: 'includes',

  timestampEntered: 'dateCreated',
  timestampModified: 'dateModified',
})

export default context
