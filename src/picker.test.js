import React from 'react';
import {expect} from 'chai';
import {shallowRender} from 'skin-deep';
import * as picker from './picker';

describe('picker', function() {
  describe('single', function() {
    const MyPicker = picker.single('TestPicker', 'ul', 'li');
    const options = ['1', '2', '3'];

    it('should render children', function() {
      const tree = shallowRender(
        <MyPicker options={options}/>
      );

      expect(tree.subTreeLike('li', {children: '1'})).to.not.be.false;
      expect(tree.subTreeLike('li', {children: '2'})).to.not.be.false;
      expect(tree.subTreeLike('li', {children: '3'})).to.not.be.false;
    });

    it('should mark value as active', function() {
      const tree = shallowRender(
        <MyPicker options={options} value={'1'}/>
      );

      expect(tree.subTreeLike('li', {children: '1'}).getRenderOutput().props)
        .to.have.property('active', true)
      ;

      expect(tree.subTreeLike('li', {children: '2'}).getRenderOutput().props)
        .to.have.property('active', false)
      ;
    });

    it('should broadcast change event', function() {
      let change;
      const tree = shallowRender(
        <MyPicker options={options} value={'1'} onChange={x => {change = x}}/>
      );

      const {onClick} = tree.subTreeLike('li', {children: '2'})
        .getRenderOutput().props
      ;

      onClick();
      expect(change).to.eql('2');
    });
  });

  describe('multiple', function() {
    const MyPicker = picker.multiple('TestPicker', 'ul', 'li');
    const options = ['1', '2', '3'];

    it('should render children', function() {
      const tree = shallowRender(
        <MyPicker options={options}/>
      );

      expect(tree.subTreeLike('li', {children: '1'})).to.not.be.false;
      expect(tree.subTreeLike('li', {children: '2'})).to.not.be.false;
      expect(tree.subTreeLike('li', {children: '3'})).to.not.be.false;
    });

    it('should mark value as active', function() {
      const tree = shallowRender(
        <MyPicker options={options} value={['1', '2']}/>
      );

      expect(tree.subTreeLike('li', {children: '1'}).getRenderOutput().props)
        .to.have.property('active', true)
      ;

      expect(tree.subTreeLike('li', {children: '2'}).getRenderOutput().props)
        .to.have.property('active', true)
      ;

      expect(tree.subTreeLike('li', {children: '3'}).getRenderOutput().props)
        .to.have.property('active', false)
      ;
    });

    it('should add unselected value to selection when clicked', function() {
      let change;
      const tree = shallowRender(
        <MyPicker options={options} value={['1']} onChange={x => {change = x}}/>
      );

      const {onClick} = tree.subTreeLike('li', {children: '2'})
        .getRenderOutput().props
      ;

      onClick();
      expect(change).to.contain('1');
      expect(change).to.contain('2');
    });

    it('should remove selected value from selection when clicked', function() {
      let change;
      const tree = shallowRender(
        <MyPicker options={options} value={['1']} onChange={x => {change = x}}/>
      );

      const {onClick} = tree.subTreeLike('li', {children: '1'})
        .getRenderOutput().props
      ;

      onClick();
      expect(change).to.not.contain('1');
    });
  });
});
