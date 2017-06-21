'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildTimeResponse = exports.buildMsg = exports.parseDataXml = exports.parseRawText = exports.CMD_HAS_ERROR = exports.CMD_SEND_ALERT = exports.CMD_SEND_SETTING = exports.CMD_SEND_DATA = exports.CMD_REQ_SETTING = exports.CMD_REQ_DATETIME = undefined;

var _xml2jsParser = require('xml2js-parser');

var CMD_REQ_DATETIME = exports.CMD_REQ_DATETIME = '1';
var CMD_REQ_SETTING = exports.CMD_REQ_SETTING = '2';
var CMD_SEND_DATA = exports.CMD_SEND_DATA = '3';
var CMD_SEND_SETTING = exports.CMD_SEND_SETTING = '4';
var CMD_SEND_ALERT = exports.CMD_SEND_ALERT = '5';
var CMD_HAS_ERROR = exports.CMD_HAS_ERROR = '0';

var parseRawText = exports.parseRawText = function parseRawText(text) {
  var lines = text.split('\r\n');
  var ctrlStr = lines[4];
  var data = lines.slice(5, -2).join('');
  return {
    cmd: /c=(\d)/.exec(ctrlStr)[1],
    data: data
  };
};

var parseDataXml = exports.parseDataXml = function parseDataXml(xml) {
  var file = (0, _xml2jsParser.parseStringSync)(xml, { explicitArray: false }).file;
  var ch1 = file.group.remote.ch[0];
  var ch2 = file.group.remote.ch[1];
  return Promise.resolve({
    device: {
      serial: file.base.serial,
      model: file.base.model,
      name: file.base.name
    },
    ch: [{
      num: ch1.num,
      name: ch1.name,
      temperature: ch1.current.value._,
      unit: ch1.current.unit
    }, {
      num: ch2.num,
      name: ch2.name,
      temperature: ch2.current.value._,
      unit: ch2.current.unit
    }]
  });
};

var buildMsg = exports.buildMsg = function buildMsg(cmd, msg) {
  return 'R=' + cmd + ',0\r\n' + msg;
};

/* eslint no-bitwise: off */
var buildTimeResponse = exports.buildTimeResponse = function buildTimeResponse() {
  var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();

  var data = [0x01, 0x00, 0x6F, 0x00, 0x06, 0x00, Number(date.getFullYear().toString().substr(-2)), date.getMonth() + 1, date.getDay(), date.getHours(), date.getMinutes(), date.getSeconds()];

  var chkSum = data.reduce(function (acc, val) {
    return acc + val;
  }, 0);
  data.push(chkSum | 0x0f);
  data.push(chkSum >>> 8);
  return data.map(function (d) {
    return ('00' + d.toString(16)).slice(-2);
  }).join('');
};