import React, {PropTypes} from 'react';
import {represent} from './prop-traits';
import widget from './widget';

export const single = listPicker({
  valueType: PropTypes.any,
  defaultValue: null,
  handleClicked: (item, {onChange}) => onChange(item),
  isActive: (item, {value}) => (item === value)
});

export const multiple = listPicker({
  valueType: PropTypes.array,
  defaultValue: [],
  handleClicked: (item, {onChange, value}) => {
    onChange(toggleValue(value, item));
  },
  isActive: (option, {value}) => value.some(x => x === option)
});

function listPicker({valueType, defaultValue, handleClicked, isActive}) {
  return (name, ContainerView, ItemView) => widget({
    name,
    type: ContainerView,
    propTypes: {
      ...ContainerView.propTypes,
      formatter: PropTypes.func,
      onChange: PropTypes.func,
      options: PropTypes.array,
      value: valueType
    },
    defaults: {
      formatter: x => x,
      onChange: () => {},
      options: [],
      value: defaultValue
    },
    children: represent('options', (option, props) =>
      <ItemView active={isActive(option, props)} onClick={() => handleClicked(option, props)}>
        {props.formatter(option)}
      </ItemView>
    )
  });
}

function toggleValue(current, toggled) {
  const items = new Set(current);

  if (items.has(toggled)) {
    items.delete(toggled);

  } else {
    items.add(toggled);
  }

  return Array.from(items);
}
