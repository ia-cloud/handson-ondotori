/* eslint no-undef: off, no-underscore-dangle: off */
import assert from 'power-assert';
import rewire from 'rewire';
import nock from 'nock';
import * as iaCloud from '../src/iaCloud';

describe('Testing iaCloud', () => {
  const url = 'http://sample.com';
  const dummyPostBody = {
    device: { serial: 'serial', model: 'model', name: 'name' },
    ch: [
      { num: '1', name: 'ch1', temperature: '30.0', unit: 'C' },
      { num: '2', name: 'ch2', temperature: '23.5', unit: 'c' },
    ],
  };
  describe('store()', () => {
    before(() => {
      nock(url).post('/').reply(200, { msg: 'success' });
    });
    after(() => {
      nock.cleanAll();
    });

    it('request POST', () => new Promise((resolve, reject) => {
      iaCloud.store(dummyPostBody, '', url)
        .then((body) => {
          assert.equal(body.msg, 'success');
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    }));
  });
  describe('connect()', () => {
    before(() => {
      nock(url).post('/').reply(200, { serviceID: 'newServiceID' });
    });
    after(() => {
      nock.cleanAll();
    });

    it('connect POST', () => new Promise((resolve, reject) => {
      iaCloud.connect(url)
        .then((id) => {
          assert.equal(id, 'newServiceID');
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    }));
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
      before(() => {
        nock(url).post('/').reply(200, { msg: 'success' });
      });
      after(() => {
        nock.cleanAll();
      });

      const post = target.__get__('post');
      it('return body when status code is 200', () => new Promise((resolve, reject) => {
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
      const packed = pack(dummyPostBody);
      it('has objectType property', () => {
        assert.ok(packed.objectType !== undefined);
      });
      it('has objectKey property', () => {
        assert.ok(packed.objectKey !== undefined);
      });
      it('has timeStamp property', () => {
        assert.ok(packed.timeStamp !== undefined);
      });
      it('has length property', () => {
        assert.ok(packed.length !== undefined);
      });
      it('has ObjectArray property', () => {
        assert.ok(packed.ObjectArray !== undefined);
      });
    });
    describe('storeFormat()', () => {
      const format = target.__get__('storeFormat');
      const formatted = format(dummyPostBody);
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
    describe('connectFormat', () => {
      const format = target.__get__('connectFormat');
      const formatted = format();
      it('request type is connect', () => {
        assert.equal(formatted.request, 'connect');
      });
      it('has userID property', () => {
        assert.ok(formatted.userID !== undefined);
      });
      it('has FDSKey property', () => {
        assert.ok(formatted.FDSKey !== undefined);
      });
      it('has FDSType property', () => {
        assert.ok(formatted.FDSType !== undefined);
      });
      it('has timeStamp property', () => {
        assert.ok(formatted.timeStamp !== undefined);
      });
      it('has comment property', () => {
        assert.ok(formatted.comment !== undefined);
      });
    });
  });
});
