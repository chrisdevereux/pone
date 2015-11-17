import React, {Component} from 'react';
import {render} from 'react-dom';

import {state} from '../core';
import {
  disclosedState, valueState,
  Button, Menu, Dropdown, MenuItem, Field, fieldType,
  DropdownSingle, DropdownMulti, ListBoxSingle, ListBoxMulti,
  App, VSplit, RecordView,
} from '../toolkit';

class Demo extends Component {
  componentWillMount() {
    this.setState({
      record: {
        name: 'Mudzilla',
        age: 40000
      }
    })
  }
  render() {
    const setState = key => value => {
      this.setState({[key]: value})
    };

    return (
      <App>
        <h2>rapid-react</h2>

        <h4>Buttons</h4>
        <VSplit>
          <div>
            <Button onClick={logEvent('Button')}>Click Me!</Button>
            <p>Enabled Button</p>
          </div>
          <div>
            <Button disabled={true} onClick={logEvent('ButtonDisabled')}>Click Me!</Button>
            <p>Disabled Button</p>
          </div>
        </VSplit>

        <h4>Lists</h4>
        <VSplit>
          <div>
            <Menu>
              <MenuItem onClick={logEvent('MenuItem1')}>First</MenuItem>
              <MenuItem onClick={logEvent('MenuItem2')}>Second</MenuItem>
              <MenuItem onClick={logEvent('MenuItem3')}>Third</MenuItem>
            </Menu>
            <p>List Box</p>
          </div>

          <div>
            <Dropdown title='Pick One' state={disclosedState}>
              <MenuItem onClick={logEvent('DropdownItem1')}>First</MenuItem>
              <MenuItem onClick={logEvent('DropdownItem2')}>Second</MenuItem>
              <MenuItem onClick={logEvent('DropdownItem3')}>Third</MenuItem>
            </Dropdown>
            <p>Dropdown Menu</p>
          </div>
        </VSplit>
        <VSplit>
          <div>
            <ListBoxSingle state={valueState} options={['First', 'Second', 'Third']}/>
            <p>List Box (Single)</p>
          </div>
          <div>
            <ListBoxMulti state={valueState} options={['First', 'Second', 'Third']}/>
            <p>List Box (Multiple)</p>
          </div>
        </VSplit>
        <VSplit>
          <div>
            <DropdownSingle title='Pick one' state={{...valueState, ...disclosedState}} options={['First', 'Second', 'Third']}/>
            <p>Dropdown (Single)</p>
          </div>
          <div>
            <DropdownMulti title='Pick one' state={{...valueState, ...disclosedState}} options={['First', 'Second', 'Third']}/>
            <p>Dropdown (Multiple)</p>
          </div>
        </VSplit>

        <h4>Record View</h4>
        <VSplit>
          <RecordView value={this.state.record} onChange={setState('record')}>
            <Field binding='name'/>
            <Field binding='age' type={fieldType.integer}/>
          </RecordView>
          <div>
            {JSON.stringify(this.state.record, null, 4)}
          </div>
        </VSplit>
      </App>
    )
  }
}

function logEvent(tag) {
  return (value) => console.log(`${tag}: ${typeof value === 'object' ? 'Bang!' : value}`);
}

render(<Demo/>, document.getElementById('app'));
