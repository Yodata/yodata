import getIn from '../helpers/getIn'

test(`gets value`, () => {
  let data = {
    path: {
      to: {
        value: 'foo'
      }
    }
  }
  expect(getIn('path.to.value')(data)).toEqual('foo')
});

test(`nothing at path`, () => {
  let data = {}
  expect(getIn('test')(data)).toBeUndefined()
});
