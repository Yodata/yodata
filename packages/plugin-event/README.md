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
@yodata/plugin-event/1.0.4 darwin-x64 node-v16.15.1
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
* [`yodata event sub [HOST] [QUERY]`](#yodata-event-sub-host-query)
* [`yodata event sub:add`](#yodata-event-subadd)
* [`yodata event sub:remove`](#yodata-event-subremove)
* [`yodata event sub:reset HOST`](#yodata-event-subreset-host)
* [`yodata event sub:stop`](#yodata-event-substop)
* [`yodata event sub:version [HOST]`](#yodata-event-subversion-host)

## `yodata event event:set-topic [TOPIC]`

set default topic

```
USAGE
  $ yodata event event:set-topic [TOPIC]

ARGUMENTS
  TOPIC  name of the topic

OPTIONS
  -o, --output=yaml|json|table|text  [default: yaml] format output
  --profile=profile                  [default: bhhs] command context
```

_See code: [src/commands/event/set-topic.js](https://github.com/Yodata/yodata/blob/v1.0.4/src/commands/event/set-topic.js)_

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
  --profile=profile             [default: bhhs] command context

ALIASES
  $ yodata event publish
```

_See code: [src/commands/pub/index.js](https://github.com/Yodata/yodata/blob/v1.0.4/src/commands/pub/index.js)_

## `yodata event sub [HOST] [QUERY]`

display all authorized publishers and subscribers on the host pod

```
USAGE
  $ yodata event sub [HOST] [QUERY]

ARGUMENTS
  HOST   the target pod
  QUERY  [default: *] filter results by agent or topic

OPTIONS
  --output

ALIASES
  $ yodata event subs
  $ yodata event subscribers
```

_See code: [src/commands/sub/index.js](https://github.com/Yodata/yodata/blob/v1.0.4/src/commands/sub/index.js)_

## `yodata event sub:add`

add topics to an existing subscription or creates a new one

```
USAGE
  $ yodata event sub:add

OPTIONS
  -p, --pub=pub              [default: ] the agent will be authorized to publish to these topics (csv)
  -s, --sub=sub              [default: ] the agent will be subscribe to these topics (csv)
  -v, --version=version      [default: 0] the subscription version
  --agent=agent              (required) the subscriber, i.e. myapp:

  --filter-type=filter-type  [default: RealEstateAgent,RealEstateOrganization] update only specific type(s) i.e.
                             RealestateAgent, RealestateOrganization, RealestateOffice

  --force                    force the subscription non-standard topic

  --host=host                the host or subscription file location i.e nv301: or
                             nv301:/settings/default-subscriptions.json

  --output

  --profile=profile          [default: bhhs] command context

  --replace                  replace the current subscription (dont merge topics)

  --verbose                  display the full subscription list after the change

DESCRIPTION
  examples:
    # add profile subscription for coolapp on the current host

    $ yodata sub:add --agent coolapp --sub profile

    # add lead and contact pub and sub on host nv301

    $ yodata sub:add --sub contact,lead --pub contact,lead --agent reliance --host nv301

    # to REPLACE a subscription rather than add topics to it, use the --replace flag
    # if this command were executed following the previous command, the reliance subscription
    # will only have contact pub/sub permissions on the host.

    $ yodata sub:add --sub contact --pub contact --agent reliace --host nv301 --replace
```

_See code: [src/commands/sub/add.js](https://github.com/Yodata/yodata/blob/v1.0.4/src/commands/sub/add.js)_

## `yodata event sub:remove`

remove a subscription entirely

```
USAGE
  $ yodata event sub:remove

OPTIONS
  -p, --pub=pub              [default: ] the agent will be authorized to publish to these topics (csv)
  -s, --sub=sub              [default: ] the agent will be subscribe to these topics (csv)
  --agent=agent              (required) the subscriber, i.e. myapp:

  --filter-type=filter-type  [default: RealEstateAgent,RealEstateOrganization] update only specific type(s) i.e.
                             RealestateAgent, RealestateOrganization, RealestateOffice

  --force                    force the subscription non-standard topic

  --host=host                the host or subscription file location i.e nv301: or
                             nv301:/settings/default-subscriptions.json

  --output

  --profile=profile          [default: bhhs] command context

  --verbose                  dispaly all subscriptions for the target after the subscription is reoved.

DESCRIPTION
  examples:
    # remove profile subscription for coolapp on the current host
    yodata sub:remove --agent coolapp --sub profile

    # remove a subscription for coolapp on host nv301
    yodata sub:remove --agent coolapp --host nv301
```

_See code: [src/commands/sub/remove.js](https://github.com/Yodata/yodata/blob/v1.0.4/src/commands/sub/remove.js)_

## `yodata event sub:reset HOST`

reset subscription to default if target.version <= source.version

```
USAGE
  $ yodata event sub:reset HOST

ARGUMENTS
  HOST  the target pod

OPTIONS
  --force          replace newer subscription doc and move previous to backup dir

  --source=source  (required) [default: settings/default-subscriptions.json] the source subscription to replace the
                   current one
```

_See code: [src/commands/sub/reset.js](https://github.com/Yodata/yodata/blob/v1.0.4/src/commands/sub/reset.js)_

## `yodata event sub:stop`

disables matching subscription(s)

```
USAGE
  $ yodata event sub:stop

OPTIONS
  -p, --pub=pub                [default: ] the agent will be authorized to publish to these topics (csv)
  -s, --sub=sub                [default: ] the agent will be subscribe to these topics (csv)
  -s, --subscriber=subscriber  filter by subscriber
  -t, --topic=topic            filter by topic
  --agent=agent                (required) the subscriber, i.e. myapp:

  --filter-type=filter-type    [default: RealEstateAgent,RealEstateOrganization] update only specific type(s) i.e.
                               RealestateAgent, RealestateOrganization, RealestateOffice

  --force                      force the subscription non-standard topic

  --host=host                  the host or subscription file location i.e nv301: or
                               nv301:/settings/default-subscriptions.json

  --output

  --profile=profile            [default: bhhs] command context
```

_See code: [src/commands/sub/stop.js](https://github.com/Yodata/yodata/blob/v1.0.4/src/commands/sub/stop.js)_

## `yodata event sub:version [HOST]`

returns the target subscription version

```
USAGE
  $ yodata event sub:version [HOST]

ARGUMENTS
  HOST  [default: .] the target pod

OPTIONS
  -o, --output=yaml|json|table|text  [default: yaml] format output
  --profile=profile                  [default: bhhs] command context
```

_See code: [src/commands/sub/version.js](https://github.com/Yodata/yodata/blob/v1.0.4/src/commands/sub/version.js)_
<!-- commandsstop -->
