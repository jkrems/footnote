# footnote

Annotation utilities for JavaScript.
Designed to be generally compatible with angular and TypeScript annotations.

```bash
npm install --save footnote
```

## Usage

Create annotation types using `RuntimeAnnotation.create`:

```js
import RuntimeAnnotation from 'footnote';

function SimpleAnnotation() {
  return RuntimeAnnotation.create(SimpleAnnotation.prototype)
    .apply(null, arguments);
}

function AnnotationWithParams(param) {
  return RuntimeAnnotation.create(AnnotationWithParams.prototype, {
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
console.log(ESNextClass.annotations); // array[1]
console.log(ESNextClass.annotations[0] instanceof SimpleAnnotation); // true
console.log(ESNextClass.prototype.foo.annotations[0] instanceof AnnotationWithParams); // true
console.log(ESNextClass.prototype.foo.annotations[0].someProperty); // 'x'

// Also supports functions and composes:
const f = SimpleAnnotation(AnnotationWithParams('y')(function() { return 'ok'; }));
console.log(f.annotations.length); // 2
console.log(f.annotations[0].someProperty); // 'y'
console.log(f()); // 'ok'
```
