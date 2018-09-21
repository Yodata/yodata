# @yodata/transform

declarative, composable JSON transformation utility.

## Installation

```bash
> npm install --save @yodata/transform
```

### 1. Define your transformation context



```yaml

# context.yaml

# rename 'name' to 'givenName' in key and/or value
# name: Bob => givenName: Bob
name: givenName

```

```javascript
const transform = require('@yodata/transform')

const toPerson = new transform.fromYaml(`
first_name: givenName
last_name: familyName
`)

# rename keys 
name: givenName  
# { name: ... } => { givenName: ... }

# rename, move and combine data easily
address1: address.streetAddress       
address2: address.streetAddress  
city: address.addressLocality
# { address1, address2, city } => { address: { streetAddress: [ address1, address2 ], city: ... } 

# renaming also works with values
Customer: Person
# { type: Customer } => { type: Person }

# remove keys with null
password: !!null
# { username: ..., password: secret123 } => { username: ... }

# use functions for complex values
id: !!js/function props => `https://example.com/${props.value}`

# configure transformation engine
'@options': 
  

```

```js
const Context = require('yodata-context');
const context = Context.load('./my_context.yaml')
                   
// transform a single object with context.transform
context.transform({name: 'Bob'})  // => { givenName: 'Bob' }

// transform multiple values with context.map
context.map([{name: 'Bob'}]) // => [ { givenName: 'Bob' } ]

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
