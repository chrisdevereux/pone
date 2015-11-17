import React, {Component} from 'react';
import {render} from 'react-dom';

import {state} from '../index';
import {
  disclosedState, valueState,
  Button, Menu, Dropdown, MenuItem, App,
  DropdownSingle, DropdownMulti, ListBoxSingle, ListBoxMulti
} from '../toolkit';

class Demo extends Component {
  render() {
    const setState = key => value => this.setState({[key]: value});

    return (
      <App>
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
              <Dropdown title='Pick One' state={disclosedState}>
                <MenuItem onClick={logEvent('DropdownItem1')}>First</MenuItem>
                <MenuItem onClick={logEvent('DropdownItem2')}>Second</MenuItem>
                <MenuItem onClick={logEvent('DropdownItem3')}>Third</MenuItem>
              </Dropdown>
              <p>Dropdown Menu</p>
            </div>
          </div>
          <div style={{display: 'table-row'}}>
            <div style={{display: 'table-cell', textAlign: 'center'}}>
              <ListBoxSingle state={valueState} options={['First', 'Second', 'Third']}/>
              <p>List Box (Single)</p>
            </div>
            <div style={{display: 'table-cell', textAlign: 'center'}}>
              <ListBoxMulti state={valueState} options={['First', 'Second', 'Third']}/>
              <p>List Box (Multiple)</p>
            </div>
          </div>
          <div style={{display: 'table-row'}}>
            <div style={{display: 'table-cell', textAlign: 'center'}}>
              <DropdownSingle title='Pick one' state={{...valueState, ...disclosedState}} options={['First', 'Second', 'Third']}/>
              <p>Dropdown (Single)</p>
            </div>
            <div style={{display: 'table-cell', textAlign: 'center'}}>
              <DropdownMulti title='Pick one' state={{...valueState, ...disclosedState}} options={['First', 'Second', 'Third']}/>
              <p>Dropdown (Multiple)</p>
            </div>
          </div>
        </div>
      </App>
    )
  }
}

function logEvent(tag) {
  return (value) => console.log(`${tag}: ${typeof value === 'object' ? 'Bang!' : value}`);
}

render(<Demo/>, document.getElementById('app'));
