'use strict';

const test = require('tape');

const Annotation = require('..');

function SimpleAnnotation() {
  return Annotation.create(SimpleAnnotation.prototype)
    .apply(null, arguments);
}

test('annotate object property', function(t) {
  const obj = {};
  Object.defineProperty(obj, 'foo',
    SimpleAnnotation(obj, 'foo', { value: function() { return 'ok'; } }));

  t.equal(obj.foo(), 'ok', 'Function still works');

  const annotations = Annotation.get(obj.foo);

  t.equal(annotations.length, 1, 'Creates 1 annotation');

  t.end();
});
