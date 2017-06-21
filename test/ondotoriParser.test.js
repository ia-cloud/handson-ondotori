/* eslint no-undef: off */
import assert from 'power-assert';
import * as parser from '../src/ondotoriParser';

const rawText = '1\r\n2\r\n3\r\n4\r\nc=5\r\ndata-line\r\n7\r\n8';
const sourceXml = `
<?xml version="1.0" encoding="UTF-8"?>
<file format="current_readings" version="1.22" name="521245ED_1378018636.xml">
   <base>
      <serial>521245ED</serial>
      <model>TR-71wf</model>
      <name>TR-71wf</name>
      <time_diff>540</time_diff>
      <std_bias>0</std_bias>
      <dst_bias>0</dst_bias>
      <time_zone />
   </base>
   <group>
      <num>0</num>
      <name>GROUP1</name>
      <remote>
         <serial>521245ED</serial>
         <model>TR-71wf</model>
         <num>1</num>
         <name>TR-71wf</name>
         <rssi />
         <ch>
            <num>1</num>
            <scale_expr />
            <name>Ch.1</name>
            <current>
               <unix_time>1378018606</unix_time>
               <time_str>2013-09-01 15:56:46</time_str>
               <value valid="true">26.8</value>
               <unit>C</unit>
               <batt>5</batt>
            </current>
            <record>
               <type>13</type>
               <unix_time>1378018606</unix_time>
               <data_id>70</data_id>
               <interval>60</interval>
               <count>1</count>
               <data>9AQ=</data>
            </record>
         </ch>
         <ch>
            <num>2</num>
            <scale_expr />
            <name>Ch.2</name>
            <current>
               <unix_time>1378018606</unix_time>
               <time_str>2013-09-01 15:56:46</time_str>
               <value valid="true">31.9</value>
               <unit>C</unit>
               <batt>5</batt>
            </current>
            <record>
               <type>13</type>
               <unix_time>1378018606</unix_time>
               <data_id>70</data_id>
               <interval>60</interval>
               <count>1</count>
               <data>JwU=</data>
            </record>
         </ch>
      </remote>
   </group>
</file>`;

const expiredJson = {
  device: {
    serial: '521245ED',
    model: 'TR-71wf',
    name: 'TR-71wf',
  },
  ch: [
    {
      num: '1',
      name: 'Ch.1',
      temperature: '26.8',
      unit: 'C',
    },
    {
      num: '2',
      name: 'Ch.2',
      temperature: '31.9',
      unit: 'C',
    },
  ],
};

describe('Testing ondotoriParser', () => {
  it('buildTimeResponse()');
  describe('buildMessage()', () => {
    it('returns formatted value', () => {
      assert.equal(parser.buildMsg(1, 'data-line'), 'R=1,0\r\ndata-line');
    });
  });
  describe('parseRawText()', () => {
    const parsed = parser.parseRawText(rawText);
    it('valid command number', () => {
      assert.equal(parsed.cmd, '5');
    });
    it('extract data part', () => {
      assert.equal(parsed.data, 'data-line');
    });
  });
  describe('parserDataXml()', () => {
    it('valid xml', () => parser.parseDataXml(sourceXml).then((json) => {
      assert.deepEqual(json, expiredJson);
    }));
    it('target property not exists', () => assert.throws(() => parser.parseDataXml('')));
  });
});
