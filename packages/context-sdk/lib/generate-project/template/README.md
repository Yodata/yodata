# {{name}}

{{description}}

Version: {{version}}

## Development

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

Edit your context [{{name}}](cdef.yaml)

```yaml
## file: cdef.yaml

$schema: '{{$schema}}'
$id: '{{hostname}}/public/context/{{name}}.yaml'
```

## Testing

```javascript
> npx jest
```

## Deploy

```sh
> npx deploy
```

This command will http.put your context to the default location (stage)

### deploy options

### --production

```sh
npx deploy
# deploys to {{hostname}}/public/context/{{name}}/{{stage}}/{{version}}/cdef.yaml

npx deploy --production
# deploys to {{hostname}}/public/context/{{name}}/{{stage}}/{{version}}/cdef.yaml

```

## Transform

```sh
npx transform <datapath> [filepath]
# @param {string} datapath - path to the file to be transformed
# @param {string} [filepath] - path to the context file ({{name}}.cdef.yaml)
# @default filepath = cdef.yaml
```

This command will

1. Fetch and parse the context from filepath
2. Fetch and parse the JSON or YAML data from datapath
3. Transform data with the context provided
4. Print the result and/or any errors to console
