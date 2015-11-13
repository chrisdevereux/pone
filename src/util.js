import compact from 'lodash/array/compact';
import mapValues from 'lodash/object/mapValues';
import pick from 'lodash/object/pick';
import isArray from 'lodash/lang/isArray';
import isArray from 'lodash/function/compose';

export {compact, mapValues, pick, isArray, compose};

export function funcify(x) {
  if (typeof x === 'function') return x;
  else return () => x;
}

export function stripUndefined(object) {
  for (const key of Object.keys(object)) {
    if (typeof object[key] === 'undefined') {
      delete object[key];
    }
  }
}

export function arrayify(children) {
  if (!exists(children)) {
    return [];

  } else if (isArray(children)) {
    return children;

  } else {
    return compact([children]);
  }
}

export function exists(x) {
  return (typeof x !== 'undefined') && (x !== false) && (x !== null);
}
