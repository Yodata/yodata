import babel from 'rollup-plugin-babel'
import babelrc from 'babelrc-rollup';
// import resolve from 'rollup-plugin-node-resolve'
// import commmonjs from 'rollup-plugin-commonjs'

export default {
  entry: 'src/index.js',
  plugins: [
    babel(babelrc())
  ],
  format: 'cjs',
  dest: 'dist/yodata-context.js',
  sourceMap: true
};
