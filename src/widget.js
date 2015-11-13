import {createElement, PropTypes} from 'react';
import {compact, mapValues, pick, arrayify, funcify, stripUndefined} from './util';

export default function widget({type, name, css, style, defaults, propTypes, ...propTransforms}) {
  defaults = defaults || {};
  type = type || 'div';

  defaults = {...type.defaults, ...defaults};
  propTypes = {...type.propTypes, ...propTypes};
  propTransforms = {...type.propTransforms, ...propTransforms};

  const whitelist = [
    ...Object.keys({...propTypes, ...propTransforms}),
    'children'
  ];
  const cssTransforms = [...arrayify(type.cssTransforms), ...arrayify(css)].map(funcify)
  const styleTransforms = mapValues({...type.styleTransforms, ...style}, funcify);

  function Widget(instanceProps) {
    const inputProps = pick({...defaults, ...instanceProps}, whitelist);

    const {...mergedProps, children, style} = {
      ...inputProps,
      ...mapValues(propTransforms, transformProps(inputProps))
    };

    const mergedClasses = compact(cssTransforms.map(transformProps(inputProps)));
    const mergedStyle = mapValues(styleTransforms, transformProps(inputProps));

    const props = {
      ...mergedProps,
      style: mergedStyle,
      className: (mergedClasses.length !== 0) && mergedClasses.join(' ')
    };

    stripUndefined(props);
    stripUndefined(props.style);

    return createElement(type, props, ...arrayify(children))
  }

  Widget.displayName = name;
  Widget.defaults = Object.freeze(defaults);
  Widget.propTypes = Object.freeze(propTypes);
  Widget.propTransforms = Object.freeze(propTransforms);
  Widget.cssTransforms = Object.freeze(cssTransforms);
  Widget.styleTransforms = Object.freeze(styleTransforms);

  return Object.freeze(Widget);
}

function transformProps(props) {
  return (transform, index) => transform(props, index);
}
