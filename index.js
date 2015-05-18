'use strict';

function pushAnnotation(target, annotation) {
  if (typeof target === 'function') {
    target.annotations = target.annotations || [];
    target.annotations.push(annotation);
  }
  return target;
}

function createRuntimeAnnotation(proto, props) {
  annotate.prototype = proto || Object.create(Object.prototype);

  function annotate(target, key, pd) {
    const annotation = Object.create(annotate.prototype, props);

    if (arguments.length === 1) {
      return pushAnnotation(target, annotation);
    } else {
      pushAnnotation(pd.value, annotation);
      return pd;
    }
  }

  return annotate;
}

exports.create = createRuntimeAnnotation;
exports.createRuntimeAnnotation = createRuntimeAnnotation;
exports['default'] = exports;
