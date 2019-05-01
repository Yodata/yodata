# my-context



## development

Setup your test (input.json) and expected result (output.json) data.

```javascript
// file: example/input.json
{
  "mytype": "Thing"
}

// file: example/output.json
{
  "type": "Thing"
}
```

Edit your context at `my-context.cdef.yaml`

```yaml
## file: my-context.cdef.yaml

$schema: 'https://realestate.yodata.me/context/v1/schema.yaml'
$id: 'https://dave.dev.yodata.io/public/context/my-context.yaml'
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
