import React, {Component} from 'react';
import {render} from 'react-dom';

import {Button} from '../toolkit';

class Demo extends Component {
  componentWillMount() {

  }

  render() {
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
      </div>
    )
  }
}

function logEvent(tag) {
  return (value) => console.log(`${tag}: ${typeof value === 'object' ? 'Bang!' : value}`);
}

render(<Demo/>, document.getElementById('app'));
