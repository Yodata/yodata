import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import babelrc from 'babelrc-rollup';
import commmonjs from 'rollup-plugin-commonjs'

let pkg = require('./package.json')

let external = Object.keys(pkg.dependencies)
let plugins = [
  babel(babelrc())
]

let lastPlugins = [
  resolve(),
  babel({
    exclude: 'node_modules/**',
  }),
  commmonjs({
    namedExports: {
      lodash: [
        'isPlainObject',
        'isNull',
        'get',
        'set',
        'has',
        'transform',
        'isString',
        'isFunction',
        'curry'
      ],
      immutable: [ 'immutable', 'Set' ],
    },
  }),
]

export default {
  entry: 'src/index.js',
  plugins: plugins,
  external: external,
  targets: [
    {
      dest: pkg.main,
      format: 'umd',
      moduleName: 'yodata-context',
      sourceMap: true
    },
    {
      dest: pkg.module,
      format: 'es',
      sourceMap: true
    }
  ]
};
