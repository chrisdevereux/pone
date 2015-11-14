import React, {PropTypes} from 'react';
import widget, {propTraits} from './index';

const {flags, wrap, compose, preventDefault, enableIf} = propTraits;

const handleClicked = compose(
  preventDefault(),
  enableIf(({disabled}) => !disabled)
);

const widgetCSSFlags = flags({
  disabled: 'disabled',
  'primary': 'primary'
});

const widgetProps = {
  disabled: PropTypes.bool,
  primary: PropTypes.bool
};
const clickableProps = {
  onClick: PropTypes.func
};

export const Button = widget({
  name: 'Button',
  type: 'button',
  css: ['button', widgetCSSFlags],
  propTypes: {
    ...widgetProps,
    onClick: React.PropTypes.func.isRequired
  }
});

export const Menu = widget({
  name: 'Menu',
  type: 'ul',
  css: ['menu', widgetCSSFlags],
  propTypes: widgetProps,
  style: {listStyle: 'none'}
});

export const MenuItem = widget({
  name: 'MenuItem',
  type: 'li',
  css: ['menu-item', widgetCSSFlags],
  propTypes: {
    ...widgetProps,
    ...clickableProps
  },
  children: wrap(<a href='#'/>, {onClick: handleClicked}),
  onClick: handleClicked
});
