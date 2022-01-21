crawl-profile-tree
==================

crawl profile sugOrganizations recursively

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/crawl-profile-tree.svg)](https://npmjs.org/package/crawl-profile-tree)
[![Downloads/week](https://img.shields.io/npm/dw/crawl-profile-tree.svg)](https://npmjs.org/package/crawl-profile-tree)
[![License](https://img.shields.io/npm/l/crawl-profile-tree.svg)](https://github.com/dduran1967/crawl-profile-tree/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @yodata/crawl-profile-tree
$ yodata crawl-profile-tree COMMAND
running command...
$ yodata crawl-profile-tree (-v|--version|version)
@yodata/crawl-profile-tree/0.5.14 darwin-x64 node-v14.17.6
$ yodata crawl-profile-tree --help [COMMAND]
USAGE
  $ yodata crawl-profile-tree COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`yodata crawl-profile-tree crawl-profile-tree [TARGET]`](#yodata-crawl-profile-tree-crawl-profile-tree-target)

## `yodata crawl-profile-tree crawl-profile-tree [TARGET]`

crawl http json objects recursively following a specified key

```
USAGE
  $ yodata crawl-profile-tree crawl-profile-tree [TARGET]

OPTIONS
  -P, --publish=publish          send update events to the profile uri provided
  -c, --concurrency=concurrency  [default: 10] number of concurrent threads
  -k, --key=key                  [default: subOrganization] key to crawl
  -o, --output=yaml|json|table   [default: yaml] format output
  -p, --profile=profile          [default: bhhs] command context
  -v, --values                   output full objects, rather than just uris
  --checksuborgs                 confirm all office suborgs have matching parentOrganization

ALIASES
  $ yodata crawl-profile-tree crawl
  $ yodata crawl-profile-tree tree
```

_See code: [src/commands/crawl-profile-tree.js](https://github.com/Yodata/yodata/blob/v0.5.14/src/commands/crawl-profile-tree.js)_
<!-- commandsstop -->
