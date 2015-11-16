import React, {createElement, PropTypes, Component} from 'react';
import {
  compact, flatten, mapValues, pick, arrayify, funcify, stripUndefined
} from './util';

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

  function Widget({...instanceProps, state}) {
    const inputProps = pick({...defaults, ...instanceProps}, whitelist);

    const {...mergedProps, children, style} = {
      ...inputProps,
      ...mapValues(propTransforms, transformProps(inputProps))
    };

    const mergedClasses = compact(flatten(cssTransforms.map(transformProps(inputProps))));
    const mergedStyle = mapValues(styleTransforms, transformProps(inputProps));

    stripUndefined(mergedStyle);

    const props = {
      ...mergedProps,
      style: Object.keys(mergedStyle).length != 0 ? mergedStyle : undefined,
      className: (mergedClasses.length !== 0) ? mergedClasses.join(' ') : undefined
    };

    if (state) {
      const stateProps = {...props, children};
      stripUndefined(stateProps);

      return <ClosedState type={type} props={stateProps} stateDef={state}/>;

    } else {
      stripUndefined(props);
      return createElement(type, props, ...arrayify(children));
    }
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
  return (transform, key) => transform(props[key], props);
}

export class ClosedState extends Component {
  render() {
    const {type, props, stateDef} = this.props;
    const stateProps = this.state || {};

    const currentProps = {...props, ...stateProps};

    const setState = (x) => this.setState(x);
    const eventHandlers = mapValues(stateDef, (stateHandler) =>
      (event) => stateHandler(event, currentProps, setState)
    );

    const {children, ...mergedProps} = {...currentProps, ...eventHandlers};
    return createElement(type, mergedProps, ...arrayify(children));
  }
}
