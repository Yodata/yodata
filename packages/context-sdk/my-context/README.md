# my-context



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

Edit your context [my-context](my-context.cdef.yaml)

```yaml
## file: my-context.cdef.yaml

$schema: 'https://realestate.yodata.me/context/v1/schema.yaml'
$id: 'https://dave.dev.yodata.io/public/context/my-context.yaml'
```

## test

```javascript
> npx jest
```

## deploy

This command will write your context to your `pod:/public/context/{environment}/my-context.cdef.yaml

```bash
> npx deploy [--production] [-f]
```

### deploy options

### --production

```bash
npx deploy
# deploys to /public/context/dev/my-context.cdef.yaml

npx deploy --production
# deploys to /public/context/my-context.cdef.yaml

```
