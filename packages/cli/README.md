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
@yodata/cli/3.6.4 darwin-x64 node-v10.15.0
$ yodata --help [COMMAND]
USAGE
  $ yodata COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`yodata delete TARGET`](#yodata-delete-target)
* [`yodata get TARGET`](#yodata-get-target)
* [`yodata help [COMMAND]`](#yodata-help-command)
* [`yodata list`](#yodata-list)
* [`yodata plugins`](#yodata-plugins)
* [`yodata plugins:install PLUGIN...`](#yodata-pluginsinstall-plugin)
* [`yodata plugins:link PLUGIN`](#yodata-pluginslink-plugin)
* [`yodata plugins:uninstall PLUGIN...`](#yodata-pluginsuninstall-plugin)
* [`yodata plugins:update`](#yodata-pluginsupdate)
* [`yodata register`](#yodata-register)
* [`yodata remove NAME`](#yodata-remove-name)
* [`yodata use PROFILE`](#yodata-use-profile)
* [`yodata whoami`](#yodata-whoami)

## `yodata delete TARGET`

HTTP DELETE pod resource

```
USAGE
  $ yodata delete TARGET

OPTIONS
  -o, --output=yaml|json|table  [default: yaml] format output
```

## `yodata get TARGET`

HTTP GET pod resource

```
USAGE
  $ yodata get TARGET

OPTIONS
  -o, --output=yaml|json|table  [default: yaml] format output
```

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

OPTIONS
  -o, --output=yaml|json|table  [default: yaml] format output

ALIASES
  $ yodata ls
```

## `yodata plugins`

list installed plugins

```
USAGE
  $ yodata plugins

OPTIONS
  --core  show core plugins

EXAMPLE
  $ yodata plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.7.8/src/commands/plugins/index.ts)_

## `yodata plugins:install PLUGIN...`

installs a plugin into the CLI

```
USAGE
  $ yodata plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  plugin to install

OPTIONS
  -f, --force    yarn install with force flag
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command 
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in 
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ yodata plugins:add

EXAMPLES
  $ yodata plugins:install myplugin 
  $ yodata plugins:install https://github.com/someuser/someplugin
  $ yodata plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.7.8/src/commands/plugins/install.ts)_

## `yodata plugins:link PLUGIN`

links a plugin into the CLI for development

```
USAGE
  $ yodata plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello' 
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLE
  $ yodata plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.7.8/src/commands/plugins/link.ts)_

## `yodata plugins:uninstall PLUGIN...`

removes a plugin from the CLI

```
USAGE
  $ yodata plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

ALIASES
  $ yodata plugins:unlink
  $ yodata plugins:remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.7.8/src/commands/plugins/uninstall.ts)_

## `yodata plugins:update`

update installed plugins

```
USAGE
  $ yodata plugins:update

OPTIONS
  -h, --help     show CLI help
  -v, --verbose
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.7.8/src/commands/plugins/update.ts)_

## `yodata register`

Add a new profile.

```
USAGE
  $ yodata register
```

## `yodata remove NAME`

Remove a profile

```
USAGE
  $ yodata remove NAME

ARGUMENTS
  NAME  profile to be removed
```

## `yodata use PROFILE`

Switch the active pod.

```
USAGE
  $ yodata use PROFILE

ARGUMENTS
  PROFILE  registered pod name

OPTIONS
  -o, --output=yaml|json  [default: yaml] format output
```

## `yodata whoami`

Get the current profile name

```
USAGE
  $ yodata whoami

OPTIONS
  -o, --output=yaml|json  [default: yaml] format output

ALIASES
  $ yodata who
```
<!-- commandsstop -->
