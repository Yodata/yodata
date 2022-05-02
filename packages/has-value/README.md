# @yodata/has-value
checks an object for a value by keyname or path in dot notation returns true if the key exists with optional comparator value or function

## example

```js
const has = require('@yodata/has-value')
const object = { a: { b: 1 }}
has(object, 'a.b') // returns true
has(object, 'a.c') // returns false

// optional comparator values

has(object, 'a.b',1) // returns true
has(object, 'a.b',2) // returns false

// optional comparator function
const comparator = (value) => { return (typeof value === 'number' && value > 1) }
has(object,'a.b', comparator) // returns false
```
