/* eslint no-undef: off, no-underscore-dangle: off */
import assert from 'power-assert';
import rewire from 'rewire';
import nock from 'nock';
import * as iaCloud from '../src/iaCloud';

describe('Testing iaCloud', () => {
  const url = 'http://sample.com';
  describe('store()', () => {
    it('request POST', () => new Promise((resolve, reject) => {
      nock(url).post('/').reply(200, { msg: 'success' });
      iaCloud.store({ isDummy: true }, `${url}/`)
        .then((body) => {
          assert.equal(body.isDummy);
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    }));
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
  describe('Testing private funcs', () => {
    const target = rewire('../src/iaCloud.js');
    describe('post()', () => {
      const post = target.__get__('post');
      it('return body when status code is 200', () => new Promise((resolve, reject) => {
        nock(url).post('/').reply(200, { msg: 'success' });
        post({ isDummy: true }, `${url}/`)
          .then((body) => {
            assert.equal(body.msg, 'success');
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      }));
      it('required request headers are set', () => new Promise((resolve, reject) => {
        nock(url, {
          reqheaders: {
            'Content-Type': 'application/json',
            authorization: headerValue => /^Basic/i.test(headerValue),
          },
        }).post('/').reply(200, { msg: 'success' });
        post({ isDummy: true }, `${url}/`)
          .then((body) => {
            assert.equal(body.msg, 'success');
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      }));
    });
    describe('packContent()', () => {
      const pack = target.__get__('packContent');
      const packed = pack({ content: 'dummy' });
      it('has objectType property', () => {
        assert.ok(packed.objectType !== undefined);
      });
      it('has objectKey property', () => {
        assert.ok(packed.objectKey !== undefined);
      });
      it('has timeStamp property', () => {
        assert.ok(packed.timeStamp !== undefined);
      });
      it('has ObjectContent property', () => {
        assert.ok(packed.ObjectContent !== undefined);
      });
    });
    describe('storeFormat()', () => {
      const format = target.__get__('storeFormat');
      const formatted = format({ content: 'dummy' });
      it('request type is store', () => {
        assert.equal(formatted.request, 'store');
      });
      it('has serviceID property', () => {
        assert.ok(formatted.serviceID !== undefined);
      });
      it('has dataObject property', () => {
        assert.ok(formatted.dataObject !== undefined);
      });
    });
  });
});
