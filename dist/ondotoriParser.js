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
      dataValue: xml.venture.company[0].name[0]
    }]
  });
};

exports.default = parse;