import test from 'tape';

import { createAnnotation, getAnnotations } from '../';

function SimpleAnnotation(arg) {
  return createAnnotation(SimpleAnnotation.prototype, {
    arg: { value: arg, enumerable: true }
  });
}

test('annotate object property', function(t) {
  const obj = {
    @SimpleAnnotation(':)')
    foo() { return 'ok'; }
  };

  t.equal(obj.foo(), 'ok', 'Function still works');

  const annotations = getAnnotations(obj.foo);

  t.equal(annotations.length, 1, 'Creates 1 annotation');
  t.ok(annotations[0] instanceof SimpleAnnotation,
    'is a SimpleAnnotation');

  t.end();
});
