'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var parse = function parse(xml) {
  return Promise.resolve({
    contentType: 'iaCloudData',
    contentData: [{
      dataName: 'temperature',
      unit: '℃',
      // dig a required property
      dataValue: xml.root.device[0].temperature[0]
    }]
  });
};

exports.default = parse;