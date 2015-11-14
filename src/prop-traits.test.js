import React from 'react';
import {expect} from 'chai';
import {shallowRender} from 'skin-deep';
import * as traits from './prop-traits';

describe('prop-traits', function() {
  describe('sequence', function() {
    it('should return fixed-size array of objects mapped from props', function() {
      const subject = traits.sequence(
        (input) => input,
        (input) => input * 2,
        (input) => input * 4
      );

      expect(subject(2)).to.eql([2, 4, 8]);
    });
  });

  describe('bindChild', function() {
    it('should return specified element, binding props onto parent', function() {
      const subject = traits.bindChild(<div prop1={1}/>, {prop2: 'parentProp'});
      const tree = subject(undefined, {parentProp: 2});

      expect(shallowRender(tree).getRenderOutput()).to.eql(
        <div prop1={1} prop2={2}/>
      );
    });
  });

  describe('flags', function() {
    it('should return array of values for active flags', function() {
      const subject = traits.flags({prop1: 1, prop2: 2});
      expect(subject(undefined, {prop1: true, prop2: false})).to.eql([1]);
    });
  });

  describe('enableIf', function() {
    const subject = traits.enableIf(({flag}) => flag);

    it('should open when predicate evaluates to true', function() {
      let value;
      subject(x => {value = x}, {flag: true})('foo');

      expect(value).to.eql('foo');
    });

    it('should close when predicate evaluates to false', function() {
      let value;
      subject(x => {value = x}, {flag: false})('foo');

      expect(value).to.not.exist;
    });
  });

  describe('wrap', function() {
    it('should wrap elements in outer element', function() {
      const subject = traits.wrap(<div id='outer'/>);
      const tree = shallowRender(
        subject([<div id='inner1'/>, <div id='inner2'/>])
      );

      expect(tree.subTree('#outer').subTree('#inner1')).to.not.be.false;
      expect(tree.subTree('#outer').subTree('#inner2')).to.not.be.false;
    });
  });

  describe('compose', function() {
    it('should apply left to right, passing in context', function() {
      const subject = traits.compose(
        (x, props) => [...x, props.a],
        (x, props) => [...x, props.b]
      );

      expect(subject([], {a: 1, b: 2})).to.eql([1, 2]);
    });
  });
});
