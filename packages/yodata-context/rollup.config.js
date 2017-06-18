import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commmonjs from 'rollup-plugin-commonjs'

export default {
  entry: 'src/index.js',
  format: 'umd',
  moduleName: 'yodata-context',
  plugins: [
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
  ],
  dest: 'dist/yodata-context.js',
};
