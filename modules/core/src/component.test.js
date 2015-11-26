/** @flow **/

import {expect} from 'chai';
import React from 'react';
import {shallowRender} from 'skin-deep';

import component from './component';

describe('component', function() {
  const MyComponent = component(
    (prev) => ({
      ...prev,
      name: 'MySuperComponent',
      type: () => 'button',
      props: {className: ({subtype}) => subtype},
      children: ({subtype}) => [<span>{subtype}</span>]
    })
  );

  it('should render element type', function() {
    const tree = shallowRender(<MyComponent/>);
    expect(tree.getRenderOutput().type).to.eql('button');
  });

  it('should render props from input', function() {
    const tree = shallowRender(<MyComponent subtype='super-important'/>);
    expect(tree.getRenderOutput().props).to.have.property('className', 'super-important');
  });

  it('should render children from input', function() {
    const tree = shallowRender(<MyComponent subtype='super-important'/>);
    expect(tree.subTreeLike('span', {}).text()).to.eql('super-important');
  });

  it('should set displayname', function() {
    expect(MyComponent.displayName).to.eql('MySuperComponent');
  });
});
