import React, {PropTypes} from 'react';
import widget, {flags} from './index';

const widgetCSSFlags = flags({
  disabled: 'disabled',
  'primary': 'primary'
});
const widgetPropTypes = {
  disabled: React.PropTypes.bool,
  primary: React.PropTypes.bool
};

export const Button = widget({
  name: 'Button',
  type: 'button',
  css: ['button', widgetCSSFlags],
  propTypes: {
    ...widgetPropTypes,
    onClick: React.PropTypes.func.isRequired
  }
});
