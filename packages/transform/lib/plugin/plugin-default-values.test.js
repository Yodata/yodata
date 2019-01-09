"use strict";

/* eslint-disable no-undef */
var Context = require('../context');

var plugin = require('./plugin-default-values');

var TOKEN = '@default';
describe('MAP', function () {
  test('assigns value of @default on MAP', function () {
    var context = new Context({
      '@default': {
        type: 'A'
      }
    }).use(plugin);
    expect(context.map({})).toEqual({
      type: 'A'
    });
  });
});
test('assigns values to the current node on map', function () {
  var context = new Context({
    '@default': {
      type: 'A'
    }
  }).use(plugin);
  expect(context.map({})).toEqual({
    type: 'A'
  });
});
test('@default does not extend to sub-contexts', function () {
  var a = new Context({
    '@default': {
      type: 'Person'
    }
  }).use(plugin);
  var b = a.extend({
    a: 'b'
  });
  expect(a.has(TOKEN)).toBe(true);
  expect(b.has(TOKEN)).toBe(false);
});
test('object properties can have different defaults from the root', function () {
  var context = new Context({
    '@default': {
      type: 'Root'
    },
    a: {
      '@context': {
        '@default': {
          type: 'A'
        }
      }
    },
    b: {
      '@context': {
        '@default': {
          type: 'B'
        }
      }
    }
  }).use(plugin);
  expect(context.map({
    a: {
      name: 'dave'
    },
    b: {
      name: 'alice'
    }
  })).toEqual({
    type: 'Root',
    a: {
      type: 'A',
      name: 'dave'
    },
    b: {
      type: 'B',
      name: 'alice'
    }
  });
});
test('@default does not assign to sub-objects', function () {
  var context = new Context({
    '@default': {
      type: 'A'
    }
  }).use(plugin);
  expect(context.map({
    name: 'name',
    parent: {
      name: 'parentName'
    }
  })).toEqual({
    type: 'A',
    name: 'name',
    parent: {
      name: 'parentName'
    }
  });
});
test('default values do not over-write data values', function () {
  var context = new Context({
    '@default': {
      type: 'A'
    }
  }).use(plugin);
  expect(context.map({
    type: 'B'
  })).toEqual({
    type: 'B'
  });
});
test('@default default => deep mapped key', function () {
  var context = new Context({
    '@default': {
      ownerType: 'Person'
    },
    ownerType: 'owner.type',
    name: 'owner.name'
  }).use(plugin);
  return expect(context.map({
    name: 'dave'
  })).toEqual({
    owner: {
      type: 'Person',
      name: 'dave'
    }
  });
});