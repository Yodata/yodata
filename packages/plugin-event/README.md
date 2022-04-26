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
@yodata/plugin-event/0.5.16 darwin-x64 node-v14.17.6
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
* [`yodata event sub [HOST]`](#yodata-event-sub-host)
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
  --profile=profile             [default: solid-dev-bhhs] command context
```

_See code: [src/commands/event/set-topic.js](https://github.com/Yodata/yodata/blob/v0.5.16/src/commands/event/set-topic.js)_

## `yodata event pub`

publish events from a file

```
USAGE
  $ yodata event pub

OPTIONS
  -c, --cdefPath=cdefPath       path to cdef
  -o, --output=yaml|json|table  [default: yaml] format output
  -r, --recipient=recipient     [default: https://dave.dev.env.yodata.io/profile/card#me] recipient
  -t, --topic=topic             topic
  --profile=profile             [default: solid-dev-bhhs] command context

ALIASES
  $ yodata event publish
```

_See code: [src/commands/pub/index.js](https://github.com/Yodata/yodata/blob/v0.5.16/src/commands/pub/index.js)_

## `yodata event sub [HOST]`

list event subscribers

```
USAGE
  $ yodata event sub [HOST]

ARGUMENTS
  HOST  the target pod

OPTIONS
  -o, --output=yaml|json|table|text  [default: table] format output
  -q, --query=query                  [default: *] filter results by agent or topic
  --profile=profile                  [default: solid-dev-bhhs] command context

ALIASES
  $ yodata event subs
  $ yodata event subscribers
```

_See code: [src/commands/sub/index.js](https://github.com/Yodata/yodata/blob/v0.5.16/src/commands/sub/index.js)_

## `yodata event sub:add`

add or update a subscription

```
USAGE
  $ yodata event sub:add

OPTIONS
  -q, --query=query  [default: *] filter results by agent or topic
  --agent=agent      (required) the subscriber, i.e. myapp:
  --host=host        the host or subscription file location i.e nv301: or nv301:/settings/default-subscriptions.json
  --output=output    [default: table]
  --profile=profile  [default: solid-dev-bhhs] command context
  --pub=pub          [default: ] the agent will be authorized to publish to these topics (csv)
  --push=push        the push target
  --replace          replace the current subscription (dont merge topics
  --sub=sub          [default: ] the agent will be subscribe to these topics (csv)

DESCRIPTION
  examples:
    # add profile subscription for myapp on the current host
    yodata sub:add --agent myapp --sub profile

    # add reliance subscription for contact and lead events from host ma301
    yodata sub:add --sub contact,lead --agent reliance --host ma301
```

_See code: [src/commands/sub/add.js](https://github.com/Yodata/yodata/blob/v0.5.16/src/commands/sub/add.js)_

## `yodata event sub:remove`

remove a subscription or topic

```
USAGE
  $ yodata event sub:remove

OPTIONS
  --agent=agent      (required) the subscriber, i.e. myapp:
  --host=host        the host or subscription file location i.e nv301: or nv301:/settings/default-subscriptions.json
  --output=output    [default: table]
  --profile=profile  [default: solid-dev-bhhs] command context
  --pub=pub          [default: ] the agent will be authorized to publish to these topics (csv)
  --sub=sub          [default: ] the agent will be subscribe to these topics (csv)

DESCRIPTION
  examples:
    # remove profile subscription for myapp on the current host
    yodata sub:remove --agent myapp --sub profile

    # remoe reliance subscription for contact and lead events from host ma301
    yodata sub:remove --sub contact,lead --agent reliance --host ma301
```

_See code: [src/commands/sub/remove.js](https://github.com/Yodata/yodata/blob/v0.5.16/src/commands/sub/remove.js)_

## `yodata event sub:stop`

disables matching subscription(s)

```
USAGE
  $ yodata event sub:stop

OPTIONS
  -o, --output=yaml|json|table  [default: yaml] format output
  -s, --subscriber=subscriber   filter by subscriber
  -t, --topic=topic             filter by topic
  --profile=profile             [default: solid-dev-bhhs] command context
```

_See code: [src/commands/sub/stop.js](https://github.com/Yodata/yodata/blob/v0.5.16/src/commands/sub/stop.js)_
<!-- commandsstop -->
