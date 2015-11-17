import React, {PropTypes} from 'react';
import widget, {propTraits, event, state, picker} from '../core';

const {
  sequence, flags, wrap, compose, preventDefault, stopPropagation, enableIf,
  transformChildren, map
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

export const RecordView = widget({
  name: 'RecordView',
  propTypes: {
    onChange: React.PropTypes.func,
    value: React.PropTypes.any
  },
  defaults: {
    onChange: (x) => {},
    value: null
  },
  children: transformChildren(({binding}, {onChange, value}) =>
    binding && {
      value: value[binding],
      onChange: (x) => {
        onChange({...value, [binding]: x})
      }
    }
  )
});

export const VSplit = widget({
  name: 'VSplit',
  style: {display: 'table', width: '100%'},
  children: compose(
    map(x => <div style={{display: 'table-cell'}}>{x}</div>),
    wrap(<div style={{display: 'table-row'}}/>)
  )
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

export const Field = widget({
  name: 'Field',
  type: 'input',
  css: ['field'],
  propTypes: {
    ...widgetProps,
    value: React.PropTypes.any,
    onChange: React.PropTypes.func,
    type: React.PropTypes.func
  },
  defaults: {
    onChange: x => {},
    type: x => x
  },
  value: (x) => {
    if (x === null || typeof x === 'undefined') {
      return '';
    } else {
      return String(x);
    }
  },
  onChange: (send, {type, value}) => (event) => {
    event.stopPropagation();
    let newValue;

    try { newValue = type(event.target.value) }
    catch(err) {
      send(value);
      return;
    }

    send(newValue);
  }
});

export const fieldType = {
  integer(x) {
    if (x === '') {
      return null;

    } else if (!/^\d+$/.test(x)) {
      throw Error();

    } else {
      return parseInt(x);
    }
  }
}

export const ListBoxSingle = picker.single('ListBoxSingle', Menu, MenuItem);
export const ListBoxMulti = picker.multiple('ListBoxMulti', Menu, MenuItem);
export const DropdownSingle = picker.single('DropdownSingle', Dropdown, MenuItem);
export const DropdownMulti = picker.single('DropdownMulti', Dropdown, MenuItem);

export const AssociatedObjects = widget({
  name: 'AssociatedObjects',
  css: ['associated-objects']
});

export const ControlGroup = widget({
  name: 'ControlGroup',
  css: ['control-group']
});

export const HelpText = widget({
  name: 'HelpText',
  css: ['help-text']
});

export const Form = widget({
  name: 'Form',
  css: ['form'],
  children: compose(
    map(el =>
      <div style={{display: 'table-row'}}>
        <div style={{display: 'table-cell'}} className='form-label'>{el.props.title}: </div>
        <div style={{display: 'table-cell'}} className='form-item'>{el}</div>
      </div>
    ),
    wrap(<div style={{display: 'table'}}/>)
  )
});

export const disclosedState = {
  onDisclose: state.toggle('disclosed'),
  [onClickRoot]: state.set({disclosed: false})
};

export const valueState = {
  onChange: state.bind('value')
};
