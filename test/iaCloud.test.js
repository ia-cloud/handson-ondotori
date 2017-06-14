/* eslint no-undef: off */
import assert from 'power-assert';
import * as iaCloud from '../src/iaCloud';

describe('Testing iaCloud', () => {
  describe('store()', () => {
    it('todo');
  });
  describe('connect()', () => {
    it('not impletented', () => {
      assert.throws(iaCloud.connect);
    });
  });
  describe('retrieve()', () => {
    it('not impletented', () => {
      assert.throws(iaCloud.retrieve);
    });
  });
  describe('getStatus()', () => {
    it('not impletented', () => {
      assert.throws(iaCloud.getStatus);
    });
  });
});
