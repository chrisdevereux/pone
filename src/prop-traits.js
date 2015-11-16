import {createElement} from 'react';
import {mapValues, compact, arrayify} from './util';

export function compose(...fns) {
  return (value, props) =>
    fns.reduce((value, fn) => fn(value, props), value)
  ;
}

export function sequence(...fns) {
  return (value, props) => fns.map(fn => fn(value, props));
}

export function represent(key, fn) {
  return (_, props) => arrayify(props[key]).map(value => fn(value, props));
}

export function bindChild(element, bindings = {}) {
  return (value, props) => {
    const {...boundProps, children} = bindProps(bindings, element, props);
    return createElement(element.type, boundProps, ...arrayify(children));
  };
}

export function flags(flags = {}) {
  return (value, props) =>
    compact(Object.keys(flags).map(key => props[key] ? flags[key] : undefined));
  ;
}

export function enableIf(predicate) {
  return (value, props) => {
    if (predicate(props)) {
      return value;

    } else {
      return () => {};
    }
  }
}

export function preventDefault() {
  return (value, props) => function(event) {
    value(event);
    event.preventDefault();
  };
}

export function wrap(element, bindings = {}) {
  return (value, props) => {
    const {...boundProps, children} = bindProps(bindings, element, props);
    return createElement(element.type, boundProps, ...arrayify(value));
  };
}

function bindProps(bindings, element, parentProps) {
  return {
    ...element.props,
    ...mapValues(bindings, (prop) => parentProps[prop])
  };
};
