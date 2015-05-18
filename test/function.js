'use strict';

const test = require('tape');

const RuntimeAnnotation = require('..');

function SimpleAnnotation() {
  return RuntimeAnnotation.create(SimpleAnnotation.prototype)
    .apply(null, arguments);
}

function AnnotationWithParams(param) {
  return RuntimeAnnotation.create(AnnotationWithParams.prototype, {
    param: { value: param }
  });
}

test('Function annotation with params', function(t) {
  function f() { return 'ok'; }

  const callResult = AnnotationWithParams('foo')(f);
  AnnotationWithParams('bar')(f);

  t.equal(callResult, f, 'returns the target');

  t.equal(f.annotations.length, 2, 'Creates 2 annotations');

  f.annotations.map(function(a) {
    t.ok(a instanceof AnnotationWithParams, 'a instanceof AnnotationWithParams');
    t.equal(a.constructor, AnnotationWithParams, 'has right constructor');
  });

  t.equal(f.annotations[0].param, 'foo');
  t.equal(f.annotations[1].param, 'bar');

  t.end();
});

test('Function annotation', function(t) {
  function f() { return 'ok'; }

  const callResult = SimpleAnnotation(f);
  const newResult = new SimpleAnnotation(f);

  t.equal(callResult, f);
  t.equal(newResult, f);

  f.annotations.map(function(a) {
    t.ok(a instanceof SimpleAnnotation, 'a instanceof SimpleAnnotation');
    t.equal(a.constructor, SimpleAnnotation);
  });

  t.end();
});
