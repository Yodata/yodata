# @yodata/context-sdk

Developer tools for managing yodata context/view yaml files.

## create a new context

You can scaffold a new context from scratch with `npx create-yodata-context`

```bash
$ npx create-yodata-context

? project name my-context
? project description my awesome context
? validationSchema: https://realestate.yodata.me/context/v1/schema.yaml
? service pod URL https://user.example.com
? pod secret (x-api-key) myapiky

  
  Nice! What next?
  
  - edit your context:
    open my-context/my-context.cdef.yaml

  - update example input and ouput:
    open my-context/__testdata__/input.js

  - test your work
    cd my-context && npx jest

  - deploy your context
    cd my-context && npx deploy

  - use your context
    POST /publish HTTP/1.1
    Host: https://user.example.com
    Content-Type: application/json;utf8

    { ... }
```
