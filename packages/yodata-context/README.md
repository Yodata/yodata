# yodata-context [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> JSON transformation toolkit, define and test transformations with a simple yet powerful and flexible JSON transformation syntax.

## Installation

```sh
$ npm install --save yodata-context
```

## Usage

```js
const Context = require('yodata-context');

// start with an example of your source data
const example = {
    ID: '1234'
    type: Customer
    name: Bob
    address1: 123 Main
    address2: #1,
    city: Mountain View
    password: secret
    
  }
 
// define a context for transforming your data

const myContext = 
{
  // rename keys 
  name: givenName
  
  // rename, move and combine data easily
  address1: 'address.streetAddress'
  address2: 'address.streetAddress'
  city: 'address.addressLocality'
  
  // renaming also works with values
  Customer: Person
  
  // remove keys from results
  password: null
  
  // advanced syntax provides full control of transformations
  ID: {
    key: id
    val: props => `xxx${props.value.substring(3)}`
  }
 
  
}                
                   
// compiles your context into a transform engine
let context = new Context(myContext)
let result = context.map(example)

// result 
{
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
}

```

## Examples
See more examples in the examples directory

## License

MIT © [Dave Duran]()


[npm-image]: https://badge.fury.io/js/yodata-context.svg
[npm-url]: https://npmjs.org/package/yodata-context
[travis-image]: https://travis-ci.org/Yodata/yodata-context.svg?branch=master
[travis-url]: https://travis-ci.org/Yodata/yodata-context
[daviddm-image]: https://david-dm.org/Yodata/yodata-context.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/Yodata/yodata-context
[coveralls-image]: https://coveralls.io/repos/Yodata/yodata-context/badge.svg
[coveralls-url]: https://coveralls.io/r/Yodata/yodata-context
