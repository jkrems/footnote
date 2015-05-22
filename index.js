'use strict';

function getAnnotations(target, type) {
  const annotations = target.annotations || [];
  if (type === undefined) return annotations;
  return annotations.filter(function (annotation) {
    return annotation instanceof type;
  });
}

function scanAnnotations(target, type) {
  return getAnnotations(target, type);
}

function pushAnnotation(target, annotation) {
  if (typeof target === 'function') {
    target.annotations = target.annotations || [];
    target.annotations.push(annotation);
  }
  return target;
}

function createAnnotation(proto, props) {
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

exports.create = createAnnotation;
exports.createAnnotation = createAnnotation;
exports.get = getAnnotations;
exports.getAnnotations = getAnnotations;
exports.scan = scanAnnotations;
exports.scanAnnotations = scanAnnotations;
exports['default'] = exports;
