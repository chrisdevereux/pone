import React from 'react';
import {expect} from 'chai';
import {shallowRender} from 'skin-deep';
import widget from './widget';

describe('widget', function() {
  it('should render with minimal config', function() {
    const MyWidget = widget({
      name: 'MyWidget'
    });

    const tree = shallowRender(<MyWidget/>);
    expect(tree.getRenderOutput().type).to.eql('div');
  });

  describe('when fully specified', function() {
    const MyWidget = widget({
      type: 'button',
      name: 'MyWidget',
      css: 'my-widget',
      style: {
        display: 'inline-block'
      },
      propTypes: {
        prop1: React.PropTypes.number
      },
      defaults: {
        prop1: 1
      },
      prop2: ({prop1}) => prop1 * 2,
      children: ({prop1}) => String(prop1)
    });

    it('should render props and children', function() {
      const tree = shallowRender(<MyWidget/>);

      expect(tree.getRenderOutput().type).to.eql('button');
      expect(tree.getRenderOutput().props.prop2).to.eql(2);
      expect(tree.text()).to.eql('1');
    });

    it('should override default props with instance-specified props', function() {
      const tree = shallowRender(<MyWidget prop1={3}/>);

      expect(tree.getRenderOutput().props.prop1).to.eql(3);
      expect(tree.getRenderOutput().props.prop2).to.eql(6);
    });

    it('should not override dynamic props with instance-specified props', function() {
      const tree = shallowRender(<MyWidget prop2={3}/>);
      expect(tree.getRenderOutput().props.prop2).to.eql(2);
    });

    it('should render only dynamic props and props specified in propTypes', function() {
      const tree = shallowRender(<MyWidget prop3={3}/>);
      expect(tree.getRenderOutput().props.prop3).to.not.exist;
    });

    it('should render style', function() {
      const tree = shallowRender(<MyWidget/>);
      expect(tree.getRenderOutput().props.style).to.eql({display: 'inline-block'});
    });
  });

  describe('when dynamic style and css are provided', function() {
    const MyWidget = widget({
      css: ['my-widget', ({flag}) => (flag && 'important')],
      style: {
        position: 'absolute',
        display: ({flag}) => (flag && 'table')
      },
      propTypes: {
        flag: React.PropTypes.boolean
      }
    });

    it('should ignore false-y dynamic class values', function() {
      const tree = shallowRender(<MyWidget/>);
      expect(tree.getRenderOutput().props.className).to.eql('my-widget');
    });

    it('should use truthy dynamic class values', function() {
      const tree = shallowRender(<MyWidget flag={true}/>);
      expect(tree.getRenderOutput().props.className).to.eql('my-widget important');
    });

    it('should ignore false-y style values', function() {
      const tree = shallowRender(<MyWidget/>);
      expect(tree.getRenderOutput().props.style).to.eql({position: 'absolute'});
    });

    it('should use truthy dynamic style values', function() {
      const tree = shallowRender(<MyWidget flag={true}/>);
      expect(tree.getRenderOutput().props.style).to.eql({position: 'absolute', display: 'table'});
    });
  });

  describe('when type is another widget type', function() {
    const InnerWidget = widget({
      name: 'Inner',
      css: ['someones-widget'],
      style : {
        position: 'absolute',
        border: 'none'
      },
      propTypes: {
        d1: React.PropTypes.string,
        d2: React.PropTypes.string
      },
      defaults: {
        d1: 'inner',
        d2: 'inner'
      },
      prop1: () => 'inner',
      prop2: () => 'inner'
    });

    const MyWidget = widget({
      name: 'Outer',
      type: InnerWidget,
      css: ['my-widget'],
      prop2: () => 'outer',
      prop3: () => 'outer',
      propTypes: {
        d2: React.PropTypes.string,
        d3: React.PropTypes.string
      },
      defaults: {
        d2: 'outer',
        d3: 'outer'
      },
      style: {
        display: 'table',
        border: 'solid'
      }
    });

    it('should use the inner type', function() {
      const tree = shallowRender(<MyWidget/>);
      expect(tree.getRenderOutput().type).to.eql(InnerWidget);
    });

    it('should combine css', function() {
      const tree = shallowRender(<MyWidget/>);
      expect(tree.getRenderOutput().props.className).to.eql('someones-widget my-widget');
    });

    it('should combine style', function() {
      const tree = shallowRender(<MyWidget/>);
      expect(tree.getRenderOutput().props.style).to.eql({border: 'solid', position: 'absolute', display: 'table'});
    });

    it('should combine props', function() {
      const tree = shallowRender(<MyWidget/>);
      expect(tree.getRenderOutput().props).to.have.property('prop1', 'inner');
      expect(tree.getRenderOutput().props).to.have.property('prop2', 'outer');
      expect(tree.getRenderOutput().props).to.have.property('prop3', 'outer');
    });

    it('should combine defaults', function() {
      const tree = shallowRender(<MyWidget/>);
      expect(tree.getRenderOutput().props).to.have.property('d1', 'inner');
      expect(tree.getRenderOutput().props).to.have.property('d2', 'outer');
      expect(tree.getRenderOutput().props).to.have.property('d3', 'outer');
    });

    it('should combine whitelisted instance props', function() {
      const tree = shallowRender(<MyWidget d1='instance'/>);
      expect(tree.getRenderOutput().props).to.have.property('d1', 'instance');
    });
  });
});