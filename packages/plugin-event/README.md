@yodata/plugin-event
====================



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@yodata/plugin-event.svg)](https://npmjs.org/package/@yodata/plugin-event)
[![Downloads/week](https://img.shields.io/npm/dw/@yodata/plugin-event.svg)](https://npmjs.org/package/@yodata/plugin-event)
[![License](https://img.shields.io/npm/l/@yodata/plugin-event.svg)](https://github.com/yodata/yodata/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @yodata/plugin-event
$ yodata event COMMAND
running command...
$ yodata event (-v|--version|version)
@yodata/plugin-event/0.2.10 darwin-x64 node-v12.16.0
$ yodata event --help [COMMAND]
USAGE
  $ yodata event COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`yodata event event:set-topic [TOPIC]`](#yodata-event-eventset-topic-topic)
* [`yodata event pub`](#yodata-event-pub)
* [`yodata event sub`](#yodata-event-sub)
* [`yodata event sub:add`](#yodata-event-subadd)
* [`yodata event sub:remove`](#yodata-event-subremove)
* [`yodata event sub:stop`](#yodata-event-substop)

## `yodata event event:set-topic [TOPIC]`

set default topic

```
USAGE
  $ yodata event event:set-topic [TOPIC]

ARGUMENTS
  TOPIC  name of the topic

OPTIONS
  -o, --output=yaml|json|table  [default: yaml] format output
  -p, --profile=profile         [default: bhhs-dave] command context
```

_See code: [src/commands/event/set-topic.js](https://github.com/Yodata/yodata/blob/v0.2.10/src/commands/event/set-topic.js)_

## `yodata event pub`

publish events from a file

```
USAGE
  $ yodata event pub

OPTIONS
  -c, --cdefPath=cdefPath       path to cdef
  -o, --output=yaml|json|table  [default: yaml] format output
  -p, --profile=profile         [default: bhhs-dave] command context
  -r, --recipient=recipient     [default: https://red-importer.bhhs.hsfaffiliates.com/profile/card#me] recipient
  -s, --source=source           (required) source file path
  -t, --topic=topic             topic

ALIASES
  $ yodata event publish
```

_See code: [src/commands/pub/index.js](https://github.com/Yodata/yodata/blob/v0.2.10/src/commands/pub/index.js)_

## `yodata event sub`

list event subscribers

```
USAGE
  $ yodata event sub

OPTIONS
  -o, --output=yaml|json|table|text  [default: table] format output
  -p, --profile=profile              [default: bhhs-dave] command context

ALIASES
  $ yodata event subs
  $ yodata event subscribers
```

_See code: [src/commands/sub/index.js](https://github.com/Yodata/yodata/blob/v0.2.10/src/commands/sub/index.js)_

## `yodata event sub:add`

add a new subscriber

```
USAGE
  $ yodata event sub:add

OPTIONS
  -p, --profile=profile  [default: bhhs-dave] command context
  --agent                the subscriber profile url
  --output
  --topic
```

_See code: [src/commands/sub/add.js](https://github.com/Yodata/yodata/blob/v0.2.10/src/commands/sub/add.js)_

## `yodata event sub:remove`

remove a subscription

```
USAGE
  $ yodata event sub:remove

OPTIONS
  -p, --profile=profile  [default: bhhs-dave] command context
  --output
```

_See code: [src/commands/sub/remove.js](https://github.com/Yodata/yodata/blob/v0.2.10/src/commands/sub/remove.js)_

## `yodata event sub:stop`

disables matching subscription(s)

```
USAGE
  $ yodata event sub:stop

OPTIONS
  -o, --output=yaml|json|table  [default: yaml] format output
  -p, --profile=profile         [default: bhhs-dave] command context
  -s, --subscriber=subscriber   filter by subscriber
  -t, --topic=topic             filter by topic
```

_See code: [src/commands/sub/stop.js](https://github.com/Yodata/yodata/blob/v0.2.10/src/commands/sub/stop.js)_
<!-- commandsstop -->
