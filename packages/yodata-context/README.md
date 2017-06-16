# yodata-context [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> JSON transformation toolkit, define and test transformations with a simple yet powerful and flexible JSON transformation syntax.

## Installation

```sh
$ npm install --save yodata-context
```

## Usage

```js
const Context = require('yodata-context');

let context = new Context({ key: 'id' })
let data = {key: 1}
context.map(data) // => {id: 1}

```
## License

MIT © [Dave Duran]()


[npm-image]: https://badge.fury.io/js/yodata-context.svg
[npm-url]: https://npmjs.org/package/yodata-context
[travis-image]: https://travis-ci.org/Yodata/yodata-context.svg?branch=master
[travis-url]: https://travis-ci.org/Yodata/yodata-context
[daviddm-image]: https://david-dm.org/Yodata/yodata-context.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/Yodata/yodata-context
[coveralls-image]: https://coveralls.io/repos/Yodata/yodata-context/badge.svg
[coveralls-url]: https://coveralls.io/r/Yodata/yodata-context
