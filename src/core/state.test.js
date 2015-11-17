import {expect} from 'chai';
import * as state from './state';

describe('state', function() {
  describe('toggle', function() {
    it('should toggle flag', function() {
      const {currentState, setState} = stubState();

      state.toggle('flag')(undefined, currentState, setState);
      expect(currentState.flag).to.be.true;
      state.toggle('flag')(undefined, currentState, setState);
      expect(currentState.flag).to.be.false;
    });
  });

  describe('bind', function() {
    it('should set state to event value', function() {
      const {currentState, setState} = stubState();

      state.bind('value')(1, currentState, setState);
      expect(currentState.value).to.eql(1);
      state.bind('value')(2, currentState, setState);
      expect(currentState.value).to.eql(2);
    });
  });

  describe('set', function() {
    it('should set state to event value', function() {
      const {currentState, setState} = stubState();

      state.set({value: 'constant'})(undefined, currentState, setState);
      expect(currentState.value).to.eql('constant');
    });
  });
});

function stubState() {
  const stub = {};

  stub.currentState = {};
  stub.setState = (x) => Object.assign(stub.currentState, x);

  return stub;
}
