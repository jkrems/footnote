'use strict';

const LOOKUP = new WeakMap();

function getAnnotations(target, type) {
  const annotations = LOOKUP.get(target) || [];
  if (type === undefined) return annotations;
  return annotations.filter(function (annotation) {
    return annotation instanceof type;
  });
}

function scanPrototypeChain(ctor, type, proto, seen) {
  if (!proto || proto === Object.prototype) {
    return [];
  }

  const own = Object.getOwnPropertyNames(proto)
    .reduce(function(found, prop) {
      if (seen.indexOf(prop) !== -1) return found;
      seen.push(prop);

      const target = proto[prop];
      if (typeof target !== 'function') return found;

      return found.concat(getAnnotations(target, type).map(function(annotation) {
        return {
          annotation: annotation,
          target: target,
          ctor: ctor,
          key: prop
        };
      }));
    }, []);

  return scanPrototypeChain(ctor, type, Object.getPrototypeOf(proto), seen)
    .concat(own);
}

function scanFunction(target, type) {
  return getAnnotations(target, type)
    .map(function (annotation) {
      return { annotation: annotation, target: target };
    });
}

function scanAnnotations(target, type) {
  if (typeof target === 'function') {
    return scanFunction(target, type)
      .concat(scanPrototypeChain(target, type, target.prototype, [ 'constructor' ]));
  } else if (target !== null && typeof target === 'object') {
    return scanPrototypeChain(target, type, target, [ 'constructor' ])
      .map(function(result) {
        return {
          annotation: result.annotation,
          target: result.target,
          ctx: result.ctor,
          key: result.key
        };
      });
  }
  return [];
}

function pushAnnotation(target, annotation) {
  if (typeof target === 'function') {
    if (!LOOKUP.has(target)) LOOKUP.set(target, []);
    LOOKUP.get(target).push(annotation);
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
