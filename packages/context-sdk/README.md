# @yodata/context-sdk

Developer tools for managing yodata context/view yaml files.

## create a new context

You can scaffold a new context from scratch with `npx create-yodata-context`

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

## CLI commands

## deploy

Deploy context to staging.

```sh
$ npx deploy

deployed to https://example.com/public/context/stage/test.cdef.yaml
```

### --production

deploys your context to production

```sh
$ npx deploy --production

deployed to https://example.com/public/context/test.cdef.yaml
```

### --production

deploys your context to production

```sh
$ npx deploy --production

deployed to https://example.com/public/context/test.cdef.yaml
```
