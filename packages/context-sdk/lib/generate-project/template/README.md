# {{sourceContext}}

{{sourceDescription}}

## development

Set the value of __testdata_/input.js to a sample of your input with all possible values.

```javascript
// __testdata__/.input.js
module.exports = {
  type: 'Person',
  name: 'Bob'
}
```


### context

Edit your context at `{{sourceContext}}.cdef.yaml`

```javascript
// file: {{sourceContext}}cdef.yaml

$schema: 'https://realestate.yodata.me/ns/v1/schema.yaml'
$id: '{{podURL}}/public/context/{{sourceContext}}.yaml'
```

## test

First, set `__testdata__/input.js` and `__testdata__/output.js` to an example 
of your source data and the expected result of transforming the input.

Test you transformation result:

```javascript
  npx jest
```

## deploy

```bash
> npx deploy
```
