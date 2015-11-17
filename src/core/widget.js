import React, {createElement, PropTypes, Component} from 'react';
import {sharedRegistry as globalEvents} from './event-registry';
import {
  compact, flatten, mapValues, pick, arrayify, funcify, stripUndefined, isSymbol
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

  function Widget({state, ...instanceProps}) {
    if (state) {
      return <ClosedState type={Widget} props={instanceProps} stateDef={state}/>;
    }

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

    stripUndefined(props);

    return createElement(type, props, ...arrayify(children));
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
  componentWillMount() {
    this.handleGlobalEvent = this.handleGlobalEvent.bind(this);
    this.registerGlobalEvents(this.props.stateDef, {});
  }

  componentWillReceiveProps(newProps) {
    this.registerGlobalEvents(newProps.stateDef, this.props.stateDef);
  }

  registerGlobalEvents(newStateDef, oldStateDef) {
    for (const key of Object.getOwnPropertySymbols(oldStateDef)) {
      if (!newStateDef[key]) {
        globalEvents.unsubscribe(key, this.handleGlobalEvent);
      }
    }

    for (const key of Object.getOwnPropertySymbols(newStateDef)) {
      if (!oldStateDef[key]) {
        globalEvents.subscribe(key, this.handleGlobalEvent);
      }
    }
  }

  componentWillUnmount() {
    for (const key of Object.getOwnPropertySymbols(this.props.stateDef)) {
      globalEvents.unsubscribe(key, this.handleGlobalEvent);
    }
  }

  handleGlobalEvent(type, value) {
    const handler = this.props.stateDef[type];
    const setState = x => this.setState(x);

    handler(value, {...this.props, ...this.state}, setState);
  }

  render() {
    const {type, props, stateDef} = this.props;
    const stateProps = this.state || {};

    const currentProps = {...props, ...stateProps};

    const setState = (x) => this.setState(x);
    const eventHandlers = mapValues(stateDef, (stateHandler) =>
      (event) => stateHandler(event, currentProps, setState)
    );

    return type({...currentProps, ...eventHandlers});
  }
}
