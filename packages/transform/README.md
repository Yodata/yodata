# @yodata/transform

declarative, composable JSON transformation utility.

## Installation

```sh
> npm install --save @yodata/transform
```

## Usage

```javascript
const {Context, pluginDefaultValues} = require('@yodata/transform')

const input = {
    Name: 'Bruce Wayne',
    Address: '1007 Mountain Drive',
    City: 'Gotham City',
    State: 'NJ',
    Zip: '00001',
    Phone: '1-800-4-BATMAN'
}

const toPerson = new Context({
    Name: 'name',
    Address: 'streetAddress',
    City: 'addressLocality',
    State: 'addressRegion',
    Zip: 'postalCode',
    Phone: 'telephone'
})

toPerson.map(input)
// result
{
  name: 'Bruce Wayne',
  streetAddress: '1007 Mountain Drive',
  addressRegion: 'NJ',
  addressLocality: 'Gotham City',
  postalCode: '00001',
  telephone: '1-800-4-BATMAN'
}

```

## Transformation features

```yaml
# Context Options
MyContext:
  id:         {string}   # sets the property name on map
  name:       {string}   # adds the property 'name' with the value provided
  value:      {any}      # replace value of source with provided value
  value:      {#name}    # gets the value from the document source
  value:      {function} # ({value, key, object}): any => { return newValue }
  value:      {function} # ({value, key, object}): any => { return newValue }
  '@context': {object}   # sub-context will be applied for current node + child nodes

```

See more examples in the examples directory

## License

MIT © [Dave Duran](mailto:dave@yodata.io)
