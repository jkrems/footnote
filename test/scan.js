'use strict';

const test = require('tape');

const Annotation = require('../');

function Simple() {
  return Annotation.create(Simple.prototype)
    .apply(null, arguments);
}

function Other() {
  return Annotation.create(Other.prototype)
    .apply(null, arguments);
}

test('scan a function without annotations', function(t) {
  function f() {}

  const annotations = Annotation.scan(f);
  t.deepEqual(annotations, [], 'No annotations expected');

  t.end();
});

test('scan a function with annotation', function(t) {
  Other(f);
  Simple(f);
  function f() {}

  const annotations = Annotation.scan(f);
  t.ok(annotations[0] instanceof Other, 'Other is found');
  t.ok(annotations[1] instanceof Simple, 'Simple is found');

  t.end();
});

test('scan a function, filtered by type', function(t) {
  Other(f);
  Simple(f);
  function f() {}

  const annotations = Annotation.scan(f, Simple);
  t.equal(annotations.length, 1, 'Finds only one annotation');
  t.ok(annotations[0] instanceof Simple, 'Finds the right annotation');

  t.end();
});
