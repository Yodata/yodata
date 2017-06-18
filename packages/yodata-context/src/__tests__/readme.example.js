import Context from '../context'

let data = {
  ID: '1234',
  type: 'Customer',
  name: 'Bob',
  address1: '123 Main',
  address2: '#1',
  city: 'Mountain View',
  password: 'secret',
}

let context = new Context({
  // rename keys
  name: 'givenName',

  // rename, move and combine data easily
  address1: 'address.streetAddress',
  address2: 'address.streetAddress',
  city: 'address.addressLocality',

  // renaming also works with values
  Customer: 'Person',

  // remove keys from results
  password: null,

  // advanced syntax provides full control of transformations
  ID: {
    key: 'id',
    val: props => `xxx${props.value.substring(3)}`,
  },
})

test(`readme`, () => {
  expect(context.map(data)).toEqual({
    id: 'xxx4',
    type: 'Person',
    givenName: 'Bob',
    address: {
      streetAddress: [
        '123 Main',
        '#1'
      ],
      addressLocality: 'Mountain View'
    }

  })
});
