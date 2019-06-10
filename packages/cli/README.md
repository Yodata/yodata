yodata
=====

yodata cli

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/mycli.svg)](https://npmjs.org/package/mycli)
[![Downloads/week](https://img.shields.io/npm/dw/mycli.svg)](https://npmjs.org/package/mycli)
[![License](https://img.shields.io/npm/l/mycli.svg)](https://github.com/yodata/yodata/yodata/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @yodata/cli
$ yodata COMMAND
running command...
$ yodata (-v|--version|version)
@yodata/cli/3.0.2-alpha.10 darwin-x64 node-v10.15.0
$ yodata --help [COMMAND]
USAGE
  $ yodata COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`yodata help [COMMAND]`](#yodata-help-command)
* [`yodata list`](#yodata-list)
* [`yodata register`](#yodata-register)
* [`yodata use PROFILE`](#yodata-use-profile)
* [`yodata whoami`](#yodata-whoami)

## `yodata help [COMMAND]`

display help for yodata

```
USAGE
  $ yodata help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.0/src/commands/help.ts)_

## `yodata list`

List registered profiles.

```
USAGE
  $ yodata list

ALIASES
  $ yodata ls
```

## `yodata register`

Add a new profile.

```
USAGE
  $ yodata register
```

## `yodata use PROFILE`

Switch the active pod.

```
USAGE
  $ yodata use PROFILE

ARGUMENTS
  PROFILE  registered pod name

OPTIONS
  -o, --output=yaml|json  format output
```

## `yodata whoami`

Get the current profile name

```
USAGE
  $ yodata whoami
```
<!-- commandsstop -->
