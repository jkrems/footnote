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

  const results = Annotation.scan(f);
  t.deepEqual(results, [], 'No annotations expected');

  t.end();
});

test('scan a function with annotation', function(t) {
  Other(f);
  Simple(f);
  function f() {}

  const results = Annotation.scan(f);
  t.ok(results[0].annotation instanceof Other, 'Other is found');
  t.ok(results[1].annotation instanceof Simple, 'Simple is found');
  t.equal(results[0].target, f, 'Returns the target');
  t.equal(results[1].target, f, 'Returns the target');

  t.end();
});

test('scan a function, filtered by type', function(t) {
  Other(f);
  Simple(f);
  function f() {}

  const results = Annotation.scan(f, Simple);
  t.equal(results.length, 1, 'Finds only one annotation');
  t.ok(results[0].annotation instanceof Simple, 'Finds the right annotation');
  t.equal(results[0].target, f, 'Returns the target');

  t.end();
});

test('scan a class', function(t) {
  class Base {
    a() {} // overridden
    b() {} // visible
  }
  Simple(Base);
  Simple(Base.prototype.a);
  Simple(Base.prototype.b);
  Other(Base.prototype.b);

  class Derived extends Base {
    a() {}
    c() {} // only in derived
  }
  Other(Derived);
  Simple(Derived);
  Simple(Derived.prototype.a);
  Simple(Derived.prototype.c);

  const results = Annotation.scan(Derived, Simple);
  t.equal(results.length, 4, '1 on class + 3 on methods = 4 found');
  t.equal(results[0].target, Derived, 'Class itself comes first');
  t.equal(results[1].target, Base.prototype.b, 'Then Base method b');
  t.equal(results[2].target, Derived.prototype.a, 'Then Derived method a');
  t.equal(results[3].target, Derived.prototype.c, 'Then Derived method c');

  t.equal(results[1].ctor, Derived, 'Includes constructor for methods (b)');
  t.equal(results[1].key, 'b', 'Includes property key for methods (b)');

  t.equal(results[2].ctor, Derived, 'Includes constructor for methods (a)');
  t.equal(results[2].key, 'a', 'Includes property key for methods (a)');

  t.equal(results[3].ctor, Derived, 'Includes constructor for methods (c)');
  t.equal(results[3].key, 'c', 'Includes property key for methods (c)');

  results.forEach(function(r) {
    t.ok(r.annotation instanceof Simple, 'Only returns Simple annotations');
  });

  t.end();
});
