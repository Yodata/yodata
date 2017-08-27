import babel from "rollup-plugin-babel";
import babelrc from "babelrc-rollup";
import resolve from "rollup-plugin-node-resolve";
import commmonjs from "rollup-plugin-commonjs";

export default {
  input: "src/index.js",
  plugins: [
    babel(babelrc()),
    resolve({ jsnext: true, main: true }),
    commmonjs({
      namedExports: {
        "node_modules/lodash.curry/index.js": ["curry"],
        "node_modules/lodash/isPlainObject.js": ["isPlainObject"]
      }
    })
  ],
  output: {
    file: "dist/yodata-context.js",
    format: "umd",
    name: "bundle.js",
    sourcemap: false
  }
};
