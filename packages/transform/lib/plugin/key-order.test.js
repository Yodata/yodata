"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('..'),
    Context = _require.Context,
    keyOrder = _require.keyOrder;

var TOKEN = '@keyOrder';
test("keyOrder - extends", function () {
  var key = TOKEN;
  var value = ['a', 'b', 'c'];
  var a = new Context(_defineProperty({}, key, value));
  var b = a.extend({
    'someOtherKey': 'someOtherValue'
  });
  expect(a.get(key)).toEqual(value);
  expect(b.get(key)).toEqual(value);
});
test("keyOrder - sorts keys alphabetically by default", function () {
  var context = new Context().use(keyOrder);
  var data = {
    c: 1,
    a: 1,
    b: 1
  };
  expect(context.map(data)).toEqual({
    a: 1,
    b: 1,
    c: 1
  });
});
test("keyOrder - @keyOrder.value = [key...] to set a custom order", function () {
  var context = new Context(_defineProperty({}, TOKEN, ['foo'])).use(keyOrder);
  var a = 1;
  var b = 2;
  var c = 3;
  var d = 4;
  var foo = 5;
  var data = {
    d: d,
    b: b,
    foo: foo,
    a: a,
    c: c
  };
  var result = context.map(data);
  console.log({
    result: result
  });
  expect(Object.keys(result)[0]).toEqual('foo');
});