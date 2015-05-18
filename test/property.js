'use strict';

const test = require('tape');

const RuntimeAnnotation = require('..');

function SimpleAnnotation() {
  return RuntimeAnnotation.create(SimpleAnnotation.prototype)
    .apply(null, arguments);
}

test('annotate object property', function(t) {
  const obj = {};
  Object.defineProperty(obj, 'foo',
    SimpleAnnotation(obj, 'foo', { value: function() { return 'ok'; } }));

  t.equal(obj.foo(), 'ok');

  t.end();
});
