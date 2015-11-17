import React, {PropTypes} from 'react';
import widget, {propTraits, event, state, picker} from './index';

const {
  sequence, flags, wrap, compose, preventDefault, stopPropagation, enableIf
} = propTraits;

const handleClicked = compose(
  preventDefault(),
  enableIf(({disabled}) => !disabled)
);

const widgetCSSFlags = flags({
  disabled: 'disabled',
  primary: 'primary'
});

const widgetProps = {
  disabled: PropTypes.bool,
  primary: PropTypes.bool
};

const clickableProps = {
  onClick: PropTypes.func
};

export const App = widget({
  name: 'App',
  type: 'div',
  css: ['app'],
  onClick: () => e => {
    event.post(onClickRoot, e);
  }
})
export const onClickRoot = Symbol('onClickRoot');

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
  css: ['menu-item', widgetCSSFlags, flags({active: 'active'})],
  propTypes: {
    ...widgetProps,
    ...clickableProps,
    active: PropTypes.bool
  },
  children: wrap(<a href='#'/>, {onClick: handleClicked}),
  onClick: handleClicked
});

export const Dropdown = widget({
  name: 'Dropdown',
  type: 'div',
  css: ['dropdown'],
  propTypes: {
    ...widgetProps,
    disclosed: PropTypes.bool,
    onDisclose: PropTypes.func,
    title: PropTypes.string.isRequired
  },
  defaults: {
    onDisclose: () => {}
  },
  children: (children, {onDisclose, disclosed, title}) => [
    <Button onClick={e => {onDisclose(); e.stopPropagation()}}>{title} ▾</Button>,
    disclosed && <Menu>{children}</Menu>
  ]
});

export const ListBoxSingle = picker.single('ListBoxSingle', Menu, MenuItem);
export const ListBoxMulti = picker.multiple('ListBoxMulti', Menu, MenuItem);
export const DropdownSingle = picker.single('DropdownSingle', Dropdown, MenuItem);
export const DropdownMulti = picker.single('DropdownMulti', Dropdown, MenuItem);

export const disclosedState = {
  onDisclose: state.toggle('disclosed'),
  [onClickRoot]: state.set({disclosed: false})
};

export const valueState = {
  onChange: state.bind('value')
};
