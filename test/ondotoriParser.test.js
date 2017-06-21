/* eslint no-undef: off */
import assert from 'power-assert';
import xml2js from 'xml2js-parser';
import parse from '../src/ondotoriParser';

// should be replace to valid ondotori format.
const sourceXml = `
<?xml version="1.0" encoding="UTF-8" ?>
<root>
  <device>
    <name>室温</name>
    <temperature>36.6</temperature>
  </device>
  <device>
    <name>サーバラック内</name>
    <temperature>40.0</temperature>
  </device>
</root>`;

const expiredJson = {
  contentType: 'iaCloudData',
  contentData: [{
    dataName: 'temperature',
    unit: '℃',
    dataValue: '36.6',
  }],
};

describe('Testing ondotoriParser', () => {
  it('valid xml', () => {
    xml2js.parseString(sourceXml, (err, result) => {
      parse(result)
        .then((json) => {
          assert.deepEqual(json, expiredJson);
        });
    });
  });
  it('target property not exists', () => {
    xml2js.parseString('', () => {
      assert.throws(() => {
        parse('').then(() => assert.fail());
      });
    });
  });
});
