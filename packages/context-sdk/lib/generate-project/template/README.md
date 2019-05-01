# {{context.name}}

{{context.description}}

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

Edit your context [{{context.name}}]({{context.name}}.cdef.yaml)

```yaml
## file: {{context.name}}.cdef.yaml

$schema: '{{context.$schema}}'
$id: '{{pod.url}}/public/context/{{context.name}}.yaml'
```

## test

```javascript
> npx jest
```

## deploy

This command will write your context to your `pod:/public/context/{environment}/{{context.name}}.cdef.yaml

```bash
> npx deploy [--production] [-f]
```

### deploy options

### --production

```bash
npx deploy
# deploys to {{podURL}}/public/context/dev/{{context.name}}.cdef.yaml

npx deploy --production
# deploys to {{podURL}}/public/context/{{context.name}}.cdef.yaml

```
