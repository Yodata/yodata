# {{sourceContext}}

{{sourceDescription}}

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

Edit your context at `{{sourceContext}}.cdef.yaml`

```yaml
## file: {{sourceContext}}.cdef.yaml

$schema: '{{validationSchema}}'
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
