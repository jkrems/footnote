'use strict';

const test = require('tape');

const Annotation = require('..');

function SimpleAnnotation() {
  return Annotation.create(SimpleAnnotation.prototype)
    .apply(null, arguments);
}

function AnnotationWithParams(param) {
  return Annotation.create(AnnotationWithParams.prototype, {
    param: { value: param }
  });
}

test('Function annotation with params', function(t) {
  function f() { return 'ok'; }

  const callResult = AnnotationWithParams('foo')(f);
  AnnotationWithParams('bar')(f);

  t.equal(callResult, f, 'returns the target');

  const annotations = Annotation.get(f);

  t.equal(annotations.length, 2, 'Creates 2 annotations');

  annotations.map(function(a) {
    t.ok(a instanceof AnnotationWithParams, 'a instanceof AnnotationWithParams');
    t.equal(a.constructor, AnnotationWithParams, 'has right constructor');
  });

  t.equal(annotations[0].param, 'foo');
  t.equal(annotations[1].param, 'bar');

  t.end();
});

test('Function annotation', function(t) {
  function f() { return 'ok'; }

  const callResult = SimpleAnnotation(f);
  const newResult = new SimpleAnnotation(f);

  t.equal(callResult, f);
  t.equal(newResult, f);

  const annotations = Annotation.get(f);

  annotations.map(function(a) {
    t.ok(a instanceof SimpleAnnotation, 'a instanceof SimpleAnnotation');
    t.equal(a.constructor, SimpleAnnotation);
  });

  t.end();
});
