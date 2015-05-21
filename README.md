# footnote

Annotation utilities for JavaScript.
Designed to be generally compatible with angular and TypeScript annotations.

```bash
npm install --save footnote
```

## Usage

Create annotation decorators using `Annotation.create`:

```js
import Annotation from 'footnote';

function SimpleAnnotation() {
  return Annotation.create(SimpleAnnotation.prototype)
    .apply(null, arguments);
}

function AnnotationWithParams(param) {
  return Annotation.create(AnnotationWithParams.prototype, {
    someProperty: { value: param }
  });
}
```

And use them:

```js
@SimpleAnnotation
class ESNextClass {
  @AnnotationWithParams('x')
  foo() {}
}

function ES5Class() {}
ES5Class.prototype.foo = function() {};
SimpleAnnotation(ES5Class);
AnnotationWithParams('x')(ES5Class.prototype, 'foo',
  Object.getOwnPropertyDescriptor(ES5Class.prototype, 'foo'));
// Or treating it as a function:
AnnotationWithParams('x')(ES5Class.prototype.foo);

// The following would work the same for `ES5Class`:
const annotations = Annotation.getAnnotations(ESNextClass);
console.log(annotations); // array[1]
console.log(annotations[0] instanceof SimpleAnnotation); // true
const fooAnnotations = Annotation.getAnnotations(ESNextClass.prototype.foo);
console.log(fooAnnotations[0] instanceof AnnotationWithParams); // true
console.log(fooAnnotations[0].someProperty); // 'x'

// Also supports functions and composes:
const f = SimpleAnnotation(AnnotationWithParams('y')(function() { return 'ok'; }));
const fnAnnotations = Annotation.getAnnotations(f);
console.log(fnAnnotations.length); // 2
console.log(fnAnnotations[0].someProperty); // 'y'
console.log(f()); // 'ok'
```
