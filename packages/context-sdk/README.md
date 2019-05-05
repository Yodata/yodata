# @yodata/context-sdk

Developer tools for managing yodata context/view yaml files.

## Context (cdef.yaml) Syntax

```yaml
$schema: 'https://realestate.yodata.me/context/v1/schema.yaml'
$id: 'https://pod.example.com/public/context/{{context.name}}.yaml'
context:
  sourcekey: targetkey
view:
  destkey: selector
```
See the [@yodata/transform documentation](https://github.com/Yodata/yodata/tree/master/packages/transform) for more info

## CLI commands

## create-yodata-context

```bash
$ npx create-yodata-context

? project name              my-context
? project description       my awesome context
? validationSchema:         https://realestate.yodata.me/context/v1/schema.yaml
? service pod URL           https://user.example.com
? pod secret (x-api-key)    secret

Done.

  - see your context README.md for some helpful information on context development:
    open my-context/README.md

$ cd my-context

```

This command creates a new sub-directory and scaffolds a context project.

## template files

```bash
.
├── README.md
├── __tests__
│   └── my-context.test.js
├── example
│   ├── input.json
│   └── output.json
├── my-context.cdef.yaml
└── package.json

```

## Deploy

```sh
> npx deploy
# deploys to {{pod.url}}/public/context/{{environment}}/{{context.name}}.cdef.yaml
# @default environment = stage
```

This command will http.put your context to the default location (stage)

### deploy options

### --production

```sh
> npx deploy --production
# deploys to {{pod.url}}/public/context/{{context.name}}.cdef.yaml
```

## Transform

```sh
> npx transform <datapath> <filepath> [--inverse]
# @param {string} datapath - path to the file to be transformed
# @param {string} filepath - path to the context file ({{context.name}}.cdef.yaml)
# @default filepath = {{context.name}}.cdef.yaml
# @param {boolean} inverse - flag (use for testing outbound transforms (subscriptions))
```

This command will:

1. Fetch and parse the context from filepath
2. Fetch and parse the JSON or YAML data from datapath
3. Transform data with the context provided
4. Print the result and/or any errors to console

