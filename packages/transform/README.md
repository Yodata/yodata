# @yodata/transform

declarative, composable JSON transformation utility.

## Installation

```bash
> npm install --save @yodata/transform
```

## Usage

```javascript
const transform = require('@yodata/transform')
const expect = require('expect')

const youHave = {
    Name: 'Bruce Wayne',
    StreetAddr: '1007 Mountain Drive'
}

const youWant = {
    '@context': 'https://schema.org/',
    name: 'Bruce Wayne',
    address: {
        streetAddress: '1007 Mountain Drive'
    }
}

const context = new transform.Context({
    '@initialValue': {
        '@context': 'https://schema.org/'
    },
    Name: 'name',
    StreetAddr: 'address.streetAddress'
})

expect(context.map(youHave)).toEqual(youWant)
```



## Transformation features

```javascript
const transform = require('@yodata/transform')

// rename keys
new transform.Context({first_name: 'givenName'}).map({first_name: 'Bruce'})
// => { givenName: 'Bruce' }

// rename values too (optionally)
new transform.Context({foo: 'BAR'}).map({foo: 'a', name: 'foo'})
// => { BAR: 'a', name: 'BAR' }

// reshape object and rename values in one pass
new transform.Context({'a': 'b.c'}).map({a: 'foo'})
// => { b: { c: 'foo' } }

// remove keys
new transform.Context({'a': null}).map({a: 'foo'})
// => {}

// use functions for complex tranformations
new transform.Context({'orange': props => `${props.key} is the new ${props.value}`})
    .map({'orange':'black'})
// => { orange: 'orange is the new black' }

// transform array values
new transform.Context({name: 'givenName'}).map([{name: 'Bob'}, {name: 'Alice'}])
// => { '0': { givenName: 'Bob' }, '1': { givenName: 'Alice' } }

```

See more examples in the examples directory

## License

MIT © [Dave Duran](mailto:dave@yodata.io)

