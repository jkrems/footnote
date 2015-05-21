'use strict';

const test = require('tape');

const Annotation = require('../');

test('read annotations by type', function (t) {
  function Inject() {
    const params = [].slice.apply(arguments);
    return Annotation.create(Inject.prototype, {
      params: { value: params, enumerable: true }
    });
  }

  function Other() {
    return Annotation.create(Other.prototype);
  }

  Inject(String)(f);
  Other()(f);
  Inject('foo')(f);
  function f(x) {}

  const injects = Annotation.getAnnotations(f, Inject);

  t.equal(injects.length, 2, 'Returns the two Inject annotations');
  t.equal(injects[0].params[0], String, 'First first');
  t.equal(injects[1].params[0], 'foo', 'Second second');

  t.end();
});
