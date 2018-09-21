import test from 'ava'
import expect from 'expect'
import {Context, defaultProps} from '..'

test(`calculated values`, t => {
  const context = new Context({
    type: () => ['a', 'b']
  })
  const data = {
    type: 'a',
    b: 'type'
  }
  const result = {
    type: ['a', 'b'],
    b: ['a', 'b']
  }
  expect(context.map(data)).toEqual(result)

  const deep = {
    items: {
      type: 'test'
    }
  }
  expect(context.map(deep)).toEqual({
    items: {
      type: ['a', 'b']
    }
  })
  const arr = {
    items: [
      {
        type: 'a'
      },
      {
        type: 'b'
      }
    ]
  }
  expect(context.map(arr)).toEqual({
    items: [
      {
        type: ['a', 'b']
      },
      {
        type: ['a', 'b']
      }
    ]
  })
  t.pass()
})

test(`defaultProps - object value`, t => {
  const context = new Context({
    item: defaultProps({
      type: 'Thing'
    })
  })
  const data = {item: {id: 1}}
  const expected = {
    item: {
      id: 1,
      type: 'Thing'
    }
  }
  expect(context.map(data)).toEqual(expected)
  t.pass()
})

test(`defaultProps - array of objects`, t => {
  const context = new Context({
    item: defaultProps({
      type: 'Thing'
    })
  })
  const data = {item: [{id: 1}]}
  const expected = {
    item: [
      {
        id: 1,
        type: 'Thing'
      }
    ]
  }
  expect(context.map(data)).toEqual(expected)
  t.pass()
})

test(`defaultProps - called on non-objects returns value`, t => {
  const context = new Context({
    a: defaultProps({type: 'Thing'})
  })
  const data = {
    a: 'string'
  }
  expect(context.map(data)).toEqual({a: 'string'})
  t.pass()
})

test(`use a value reducer to create a calculated field`, t => {
  const data = {
    key: 1,
    nextKey: 0
  }
  const context = new Context({
    nextKey: ({last}) => last.key + 1
  })
  expect(context.map(data)).toEqual({
    key: 1,
    nextKey: 2
  })
  t.pass()
})

test(`context functions can mutate the root object`, t => {
  const data = {
    event: {
      primary: 'Add',
      secondary: ['Update']
    }
  }
  const context = new Context({
    event: {
      key: 'action',
      val: ({value, last}) => ({type: value.primary})
    }
  })
  const result = context.map(data)
  expect(result).toMatchObject({
    action: {
      type: 'Add'
    }
  })
  t.pass()
})

test(`extend source or set defaults with initialValue`, t => {
  const data = {
    key: 1
  }
  const context = new Context({
    key: 'id'
  })
  const initialValue = {
    type: 'Person',
    name: 'Dave'
  }
  expect(context.map(data, initialValue)).toEqual({
    id: 1,
    type: 'Person',
    name: 'Dave'
  })
  t.pass()
})
