"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// @flow
// @ts-check
var set = require('lodash/set');

var get = require('lodash/get');

var has = require('lodash/has');

var castArray = require('lodash/castArray');

var transform = require('lodash/transform');

var toPath = require('lodash/toPath');

var _mapKeys = require('lodash/mapKeys');

var _require = require('immutable'),
    Set = _require.Set,
    Map = _require.Map,
    fromJS = _require.fromJS,
    merge = _require.merge,
    List = _require.List;

var YAML = require('js-yaml');

var NODE_ENV = process.env.NODE_ENV;
var log = console.log;

var _require2 = require('./constants'),
    DEFAULT_OPTIONS = _require2.DEFAULT_OPTIONS,
    DEFAULT_CONTEXT = _require2.DEFAULT_CONTEXT;

var _require3 = require('./events'),
    MAP = _require3.MAP,
    MAP_RESULT = _require3.MAP_RESULT,
    PLUGIN_INSTALLED = _require3.PLUGIN_INSTALLED,
    EXTEND = _require3.EXTEND,
    PARSE = _require3.PARSE;

var _require4 = require('./terms'),
    CONTEXT = _require4.CONTEXT,
    ID = _require4.ID,
    REMOVE = _require4.REMOVE,
    VALUE = _require4.VALUE,
    ADDITIONAL_PROPERTIES = _require4.ADDITIONAL_PROPERTIES,
    NEST = _require4.NEST,
    NAME = _require4.NAME,
    CONTAINER = _require4.CONTAINER,
    SET = _require4.SET,
    LIST = _require4.LIST,
    REDACT = _require4.REDACT;

var parseContextValue = require('./parse-context-value');

var mapValueToContext = require('./map-value-to-context');
/**
 *
 * @param {string} key
 * @returns {string[]}
 */


var pathArray = function pathArray(key) {
  if (typeof key === 'string' && key.includes('http') && key.includes('://')) {
    return [key];
  }

  return toPath(key);
};

var Context =
/*#__PURE__*/
function () {
  /**
   * Creates a new transformation Cotnext
   * @param {*} contextDefinition
   * @param {*} options
   */
  function Context() {
    var contextDefinition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Context);

    this.options = new Map().merge(DEFAULT_OPTIONS, options);
    this.plugins = new Set();
    this.cdef = new Map().merge(DEFAULT_CONTEXT, this.parseContext(contextDefinition));
  }
  /**
    * Creates a transform context from a YAML string
    * @param {string} yaml - the context source in YAML.
    * @returns {Context}
    */


  _createClass(Context, [{
    key: "parseContext",

    /**
      * Parse & normalize a context definition JSON string
      * @param {object} contextDefinition
      * @returns {object}
      */
    value: function parseContext(contextDefinition) {
      var state = this.dispatch(PARSE, contextDefinition, this);
      return new Map(state).map(parseContextValue).toJS();
    }
    /**
     * Creates a new context from the current + the provided context definition document.
     * @param {object} cdef - a valid context definition object
     * @param {object} [options]
     * @returns {Context}
     */

  }, {
    key: "extend",
    value: function extend(cdef, options) {
      var object = this.parseContext(cdef);
      var target = this.toJS();
      var beforeMerge = this.dispatch(EXTEND, {
        object: object,
        target: target
      }, this);
      log('beforeMerge');
      log({
        object: object,
        target: target,
        beforeMerge: beforeMerge
      });
      var merged = merge(get(beforeMerge, 'target'), get(beforeMerge, 'object'));
      var nextContext = new Context(merged, options);
      nextContext.plugins = this.plugins.toSet();
      return nextContext;
    }
    /**
     *
     * @returns {JSON}
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      var object = this.toJS();
      return JSON.stringify(object);
    }
    /**
     * Returns a plain javascript object representation of the current context
     * @returns {object}
     */

  }, {
    key: "toJS",
    value: function toJS() {
      return this.cdef.toJS();
    }
    /**
     *
     * @param {string} key
     * @param {*} value
     * @returns {Context}
     */

  }, {
    key: "setOption",
    value: function setOption(key, value) {
      // $FlowFixMe
      this.options = this.options.setIn(pathArray(key), value);
      return this;
    }
    /**
     *
     * @param {string} key
     * @param {*} defaultValue
     * @returns {*}
     */

  }, {
    key: "getOption",
    value: function getOption(key, defaultValue) {
      // $FlowFixMe
      return this.options.getIn(pathArray(key), defaultValue);
    }
    /**
     *
     * @param {string|string[]} key
     * @returns {boolean}
     */

  }, {
    key: "has",
    value: function has(key) {
      var target = pathArray(key);
      return this.cdef.hasIn(target);
    }
    /**
     *
     * @param {string|string[]} keyPath
     * @param {*} [defaultValue]
     * @returns {*}
     */

  }, {
    key: "get",
    value: function get(key, defaultValue) {
      var target = pathArray(key);
      return this.has(target) ? this.cdef.getIn(target) : defaultValue;
    }
    /**
     * True if the provided key will be removed on transform
     * @param {string|string[]} key
     * @returns {boolean}
     */

  }, {
    key: "isRemoved",
    value: function isRemoved(key) {
      var target = pathArray(key);
      return this.has(target.concat(REMOVE));
    }
    /**
     * True if the provided key will be redacted on transform
     * @param {string|string[]} key
     * @returns {boolean}
     */

  }, {
    key: "isRedacted",
    value: function isRedacted(key) {
      var target = pathArray(key);
      return this.has(target.concat(REDACT));
    }
    /**
     * True if the context allows out-of-context values
     * @property {boolean}
     */

  }, {
    key: "isAllowed",

    /**
     *
     * @param {string|string[]} key
     * @returns {boolean}
     */
    value: function isAllowed(key) {
      return this.has(key) ? !this.isRemoved(key) : this.allowsAdditionalProperties;
    }
    /**
     * Returns the context name of key
     * @param {string|string[]} key
     * @param {*} [defaultValue]
     * @returns {string}
     */

  }, {
    key: "mapKey",
    value: function mapKey(key, defaultValue) {
      var container = this.get([key, NEST]);
      var nextKey = this.get([key, ID], defaultValue) || key;
      return container ? "".concat(container, ".").concat(nextKey) : nextKey;
    }
    /**
     * Returns a new copy of object with the keys renamed by the active context (this)
     * @param {object} object
     * @returns {object}
     */

  }, {
    key: "mapKeys",
    value: function mapKeys(object) {
      var _this = this;

      return _mapKeys(object, function (v, k) {
        return _this.mapKey(k, k);
      });
    }
    /**
     * Executes the current context for the key/value pair and returns the resulting value
     * @param {*} value - the value
     * @param {string|string[]} key - the key
     * @param {*} [object]
     * @param {*} [context]
     */

  }, {
    key: "mapValue",
    value: function mapValue(value, key) {
      var object = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var context = arguments.length > 3 ? arguments[3] : undefined;
      var activeContext = context || this.get(key, this.toJS());
      return mapValueToContext.call(this, value, key, object, activeContext);
    }
    /**
     * Processes the key/value pair with the current context and returns the resulting key/value pair or void if the key is not allowed
     * @param {[string,*]} entry - key,value pair
     * @returns {[string,*]|undefined}
     */

  }, {
    key: "mapEntry",
    value: function mapEntry(entry) {
      var _entry = _slicedToArray(entry, 2),
          key = _entry[0],
          value = _entry[1];

      var nextKey = this.mapKey(key, key);
      var nextValue = this.mapValue(value, key);
      return [nextKey, nextValue];
    }
    /**
     * Process object with the current context
     * non-destructive - always returns a new object
     * @param {object} object
     * @param {object} [initialValue]
     * @returns {object} - the resulting state of object
     */

  }, {
    key: "map",
    value: function map() {
      var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var initialValue = arguments.length > 1 ? arguments[1] : undefined;
      var transformer = this.transformEntry.bind(this);
      var state = fromJS(object); // $FlowFixMe

      state = state.toJS();
      state = this.dispatch(MAP, state, {
        initialValue: initialValue,
        context: this
      });
      state = transform(state, transformer, initialValue);
      state = this.dispatch(MAP_RESULT, state, this);
      return state;
    }
    /**
     * Adds value to target.key.
     * if target.key does not exist it will be created.
     * if target.key is a scalar, it will be converted to an array and the new value will be pushed
     * if target.key is an array, the new value is pushed to target.key
     * if target.key is an object and value is an object, target.key will be recursively processed in the same manor
     * @param {object} target - the object being transformed
     * @param {*} value - the value to add to target.key
     * @param {string} key - the key
     * @param {*} object - the original (source) object
     * @returns {object} - the next state of target
     */

  }, {
    key: "transformEntry",
    value: function transformEntry(target, value, key, object) {
      if (this.isAllowed(key)) {
        var targetKey = pathArray(this.mapKey(key, key));
        var targetValue = get(target, targetKey);
        var objectValue = this.mapValue(value, key, object);
        var targetContainer = this.get([targetKey, CONTAINER]);
        var nextValue = targetValue ? castArray(targetValue).concat(objectValue) : objectValue;

        switch (targetContainer) {
          case LIST:
            nextValue = List(castArray(nextValue)).toArray();
            break;

          case SET:
            nextValue = new Set(castArray(nextValue)).toArray();
            break;
        }

        set(target, targetKey, nextValue);
      }

      return target;
    }
    /**
     *
     * @param {function} plugin
     * @param {object} [options]
     * @returns {Context}
     */

  }, {
    key: "use",
    value: function use(plugin, options) {
      plugin.call(this, PLUGIN_INSTALLED, options, this);
      this.plugins = this.plugins.add(plugin);
      return this;
    }
    /**
     * Emits event to plug-in handlers
     * @param {string} event
     * @param {object} [data]
     * @param {*} [context]
     */

  }, {
    key: "dispatch",
    value: function dispatch(event) {
      var _this2 = this;

      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var context = arguments.length > 2 ? arguments[2] : undefined;
      log('DISPATCH', {
        event: event,
        data: data,
        context: context
      });
      var state = fromJS(data); // $FlowFixMe

      var next = state.toJS();
      this.plugins.forEach(function (plugin) {
        next = plugin.call(_this2, event, next, context);
      });
      log('dispatch:completed', {
        data: data,
        next: next
      });
      return next;
    }
  }, {
    key: "allowsAdditionalProperties",
    get: function get() {
      return this.has(ADDITIONAL_PROPERTIES) ? this.get(ADDITIONAL_PROPERTIES) : this.getOption(ADDITIONAL_PROPERTIES, false);
    }
  }], [{
    key: "fromYaml",
    value: function fromYaml(yaml) {
      return new Context(YAML.load(yaml));
    }
  }]);

  return Context;
}();

module.exports = Context;