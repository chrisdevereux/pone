import React, {Component} from 'react';
import {render} from 'react-dom';

import {state} from '../index';
import {Button, Menu, Dropdown, MenuItem} from '../toolkit';

class Demo extends Component {
  render() {
    const setState = key => value => this.setState({[key]: value});

    return (
      <div style={{display: 'table', width: '100%'}}>
        <h2>rapid-react</h2>

        <h4>Buttons</h4>
        <div style={{display: 'table-row'}}>
          <div style={{display: 'table-cell', textAlign: 'center'}}>
            <Button onClick={logEvent('Button')}>Click Me!</Button>
            <p>Enabled Button</p>
          </div>
          <div style={{display: 'table-cell', textAlign: 'center'}}>
            <Button disabled={true} onClick={logEvent('ButtonDisabled')}>Click Me!</Button>
            <p>Disabled Button</p>
          </div>
        </div>

        <h4>Lists</h4>
        <div style={{display: 'table-row'}}>
          <div style={{display: 'table-cell', textAlign: 'center'}}>
            <Menu>
              <MenuItem onClick={logEvent('MenuItem1')}>First</MenuItem>
              <MenuItem onClick={logEvent('MenuItem2')}>Second</MenuItem>
              <MenuItem onClick={logEvent('MenuItem3')}>Third</MenuItem>
            </Menu>
            <p>List Box</p>
          </div>

          <div style={{display: 'table-cell', textAlign: 'center'}}>
            <Dropdown title='Pick One' state={{onDisclose: state.toggle('disclosed')}}>
              <MenuItem onClick={logEvent('DropdownItem1')}>First</MenuItem>
              <MenuItem onClick={logEvent('DropdownItem2')}>Second</MenuItem>
              <MenuItem onClick={logEvent('DropdownItem3')}>Third</MenuItem>
            </Dropdown>
            <p>Dropdown Menu</p>
          </div>
        </div>
      </div>
    )
  }
}

function logEvent(tag) {
  return (value) => console.log(`${tag}: ${typeof value === 'object' ? 'Bang!' : value}`);
}

render(<Demo/>, document.getElementById('app'));
