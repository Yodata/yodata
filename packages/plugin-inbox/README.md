@yodata/plugin-inbox
====================

@yodata/cli inbox 

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@yodata/plugin-inbox.svg)](https://npmjs.org/package/@yodata/plugin-inbox)
[![Downloads/week](https://img.shields.io/npm/dw/@yodata/plugin-inbox.svg)](https://npmjs.org/package/@yodata/plugin-inbox)
[![License](https://img.shields.io/npm/l/@yodata/plugin-inbox.svg)](https://github.com/yodata/plugin-inbox/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @yodata/plugin-inbox
$ yodata inbox COMMAND
running command...
$ yodata inbox (-v|--version|version)
@yodata/plugin-inbox/0.7.2 darwin-x64 node-v12.19.0
$ yodata inbox --help [COMMAND]
USAGE
  $ yodata inbox COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`yodata inbox inbox`](#yodata-inbox-inbox)
* [`yodata inbox inbox:list`](#yodata-inbox-inboxlist)
* [`yodata inbox inbox:next`](#yodata-inbox-inboxnext)
* [`yodata inbox inbox:reset`](#yodata-inbox-inboxreset)
* [`yodata inbox inbox:store`](#yodata-inbox-inboxstore)

## `yodata inbox inbox`

manage inbox items

```
USAGE
  $ yodata inbox inbox

OPTIONS
  -o, --output=yaml|json|table  [default: yaml] format output
  -p, --profile=profile         [default: bhhs] command context
```

_See code: [src/commands/inbox/index.js](https://github.com/Yodata/yodata/blob/v0.7.2/src/commands/inbox/index.js)_

## `yodata inbox inbox:list`

list inbox items

```
USAGE
  $ yodata inbox inbox:list

OPTIONS
  -H, --hours=hours      get messages in the last X hours
  -o, --output=output    [default: table] output format
  -p, --profile=profile  [default: bhhs] command context
  --by=timestamp|token   query type (timestamp/token)
  --format=link|full
  --from=from            starting point

ALIASES
  $ yodata inbox inbox:ls
```

_See code: [src/commands/inbox/list.js](https://github.com/Yodata/yodata/blob/v0.7.2/src/commands/inbox/list.js)_

## `yodata inbox inbox:next`

advance to the next page of inbox messages

```
USAGE
  $ yodata inbox inbox:next

OPTIONS
  -o, --output=output    [default: table] output format
  -p, --profile=profile  [default: bhhs] command context
  --by=timestamp|token   query type (timestamp/token)
  --format=link|full
  --from=from            starting point
```

_See code: [src/commands/inbox/next.js](https://github.com/Yodata/yodata/blob/v0.7.2/src/commands/inbox/next.js)_

## `yodata inbox inbox:reset`

reset inbox

```
USAGE
  $ yodata inbox inbox:reset

OPTIONS
  -o, --output=yaml|json|table  [default: yaml] format output
  -p, --profile=profile         [default: bhhs] command context
```

_See code: [src/commands/inbox/reset.js](https://github.com/Yodata/yodata/blob/v0.7.2/src/commands/inbox/reset.js)_

## `yodata inbox inbox:store`

display inbox data

```
USAGE
  $ yodata inbox inbox:store

OPTIONS
  -o, --output=yaml|json|table  [default: yaml] format output
  -p, --profile=profile         [default: bhhs] command context
```

_See code: [src/commands/inbox/store.js](https://github.com/Yodata/yodata/blob/v0.7.2/src/commands/inbox/store.js)_
<!-- commandsstop -->
