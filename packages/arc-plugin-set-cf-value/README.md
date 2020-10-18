# arc-plugin-set-cf-value

set CF override values on deploy

## useage

Install the plugin: ` $ npm install -D @yodata/arc-plugin-set-cf-value`

## Configure

```sh
# app.arc
@app
footest

@http
post /

@macros
@yodata/arc-plugin


@set-cf-values
# {key} {value}
Resources.PostIndex.Properties.FunctionName fooname

```