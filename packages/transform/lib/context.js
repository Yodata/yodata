"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* eslint-disable unicorn/new-for-builtins */

/* eslint-disable new-cap */
// @flow
// @ts-check
var set = require('lodash/set');

var get = require('lodash/get');

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

var log = require('debug')('transform');

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
    ID = _require4.ID,
    REMOVE = _require4.REMOVE,
    ADDITIONAL_PROPERTIES = _require4.ADDITIONAL_PROPERTIES,
    NEST = _require4.NEST,
    CONTAINER = _require4.CONTAINER,
    SET = _require4.SET,
    LIST = _require4.LIST,
    REDACT = _require4.REDACT;

var parseContextValue = require('./parse-context-value');

var mapValueToContext = require('./map-value-to-context');
/**
 * Converts a path expression a.b.c to a path array [a,b,c]
 * @param {string | string[]} key - the path or path array
 * @returns {string[]} pathArray
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
   * @param {*} [contextDefinition] a valid ContextDefinition object
   * @param {*} [options] configuration options
   */
  function Context() {
    var contextDefinition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Context);

    this.options = Map().merge(DEFAULT_OPTIONS, options);
    this.plugins = Set();
    this.cdef = Map().merge(DEFAULT_CONTEXT, this.parseContext(contextDefinition));
  }
  /**
    * Creates a transform context from a YAML string
    * @param {string} yaml - the context source in YAML.
    * @returns {Context} transformation Context
    */


  _createClass(Context, [{
    key: "parseContext",

    /**
      * Parse & normalize a context definition JSON string
      * @param {object} contextDefinition a valid ContextDefinition
      * @returns {object} normalized ContextDefinition document
      */
    value: function parseContext(contextDefinition) {
      var state = this.dispatch(PARSE, contextDefinition, this);
      return Map(state).map(parseContextValue).toJS();
    }
    /**
     * Creates a new context from the current + the provided context definition document.
     * @param {object} cdef - a valid context definition object
     * @param {object} [options] - optional configuration and plugin options
     * @returns {Context} a new Context
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
     * Returns JSON representation of the Context Definition
     * @returns {string} JSON ContextDefinition
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      var object = this.toJS();
      return JSON.stringify(object);
    }
    /**
     * Returns a plain javascript object representation of the current context
     * @returns {object} - JavaScript object representation of the current context
     */

  }, {
    key: "toJS",
    value: function toJS() {
      return this.cdef.toJS();
    }
    /**
     * Sets or creates a context.options.key value
     * @param {string} key option.name
     * @param {*} value option.value
     * @returns {Context} Context
     */

  }, {
    key: "setOption",
    value: function setOption(key, value) {
      this.options = this.options.setIn(pathArray(key), value);
      return this;
    }
    /**
     * Get an option value
     * @param {string} key option.name
     * @param {*} [defaultValue] optional defaultValue
     * @returns {*} option.value | defaultValue
     */

  }, {
    key: "getOption",
    value: function getOption(key, defaultValue) {
      return this.options.getIn(pathArray(key), defaultValue);
    }
    /**
     * Checks the current context for key
     * @param {string|string[]} key key to find
     * @returns {boolean} true if the current context contains key
     */

  }, {
    key: "has",
    value: function has(key) {
      var target = pathArray(key);
      return this.cdef.hasIn(target);
    }
    /**
     * Returns the value of key from the current context
     * @param {string|string[]} key the property to find
     * @param {*} [defaultValue] optional defaultValue
     * @returns {*} key.value | defaultValue
     */

  }, {
    key: "get",
    value: function get(key, defaultValue) {
      var target = pathArray(key);
      return this.has(target) ? this.cdef.getIn(target) : defaultValue;
    }
    /**
     * True if the provided key will be removed on transform
     * @param {string|string[]} key the property to find
     * @returns {boolean} true if the property found in the current context
     */

  }, {
    key: "isRemoved",
    value: function isRemoved(key) {
      var target = pathArray(key);
      return this.has(target.concat(REMOVE));
    }
    /**
     * True if the provided key will be redacted on transform
     * @param {string|string[]} key the property to find
     * @returns {boolean} true if property.redact = true
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
      // @ts-ignore
      var container = this.get([key, NEST]); // @ts-ignore

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
        var objectValue = this.mapValue(value, key, object); // @ts-ignore

        var targetContainer = this.get([targetKey, CONTAINER]);
        var nextValue = targetValue ? castArray(targetValue).concat(objectValue) : objectValue; // eslint-disable-next-line default-case

        switch (targetContainer) {
          case LIST:
            nextValue = List(castArray(nextValue)).toArray();
            break;

          case SET:
            nextValue = Set(castArray(nextValue)).toArray();
            break;
        }

        set(target, targetKey, nextValue);
      }

      return target;
    }
    /**
     * Adds a plugin to the context
     * @param {function} plugin
     * @param {object} [options]
     * @returns {Context} the new context with plugin installed
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
     * @returns {Context} the current context
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