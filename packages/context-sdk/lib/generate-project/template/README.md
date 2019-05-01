# {{sourceContext}}

{{sourceDescription}}

## development

Setup your prototype [input](example/input.json) and [output](example/output.json) data in the examples directory.

```javascript
// file: example/input.json
{
  "mytype": "Thing"
}
```

```javascript
// file: example/output.json
{
  "type": "Thing"
}
```

Edit your context [{{sourceContext}}]({{sourceContext}}.cdef.yaml)

```yaml
## file: {{sourceContext}}.cdef.yaml

$schema: '{{validationSchema}}'
$id: '{{podURL}}/public/context/{{sourceContext}}.yaml'
```

## test

```javascript
> npx jest
```

## deploy

This command will write your context to your `pod:/public/context/{environment}/{{sourceContext}}.cdef.yaml

```bash
> npx deploy [--production] [-f]
```

### deploy options

### --production

```bash
npx deploy
# deploys to {{podURL}}/public/context/dev/{{sourceContext}}.cdef.yaml

npx deploy --production
# deploys to {{podURL}}/public/context/{{sourceContext}}.cdef.yaml

```
