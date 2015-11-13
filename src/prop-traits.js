import {createElement} from 'react';
import {mapValues, compact, arrayify, compose} from './util';

export {compose};

export function sequence(...fns) {
  return (parentProps) => fns.map(fn => fn(parentProps));
}

export function bindChild(element, bindings = {}) {
  return (parentProps) => {
    const {...props, children} = {
      ...element.props,
      ...mapValues(bindings, (prop) => parentProps[prop])
    };

    return createElement(element.type, props, ...arrayify(children));
  };
}

export function flags(flags = {}) {
  return (parentProps) =>
    compact(Object.keys(flags).map(key => parentProps[key] && flags[key]));
  ;
}

export function enableIf(eventKey, predicate) {
  return (parentProps) => {
    if (predicate(parentProps)) {
      return parentProps[eventKey];

    } else {
      return () => {};
    }
  }
}

export function wrap(outer) {
  const {type} = outer;
  const {...props, children} = outer.props;

  return (parentProps, key) => createElement(type, props, ...arrayify(parentProps[key]));
}
