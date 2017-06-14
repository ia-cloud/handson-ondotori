'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStatus = exports.retrieve = exports.connect = exports.store = undefined;

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _uuid = require('uuid');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var post = function post(payload) {
  var opts = {
    url: 'https://a6c9402vn9.execute-api.ap-northeast-1.amazonaws.com/Test3_Stage/test3',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    auth: {
      user: '',
      password: ''
    },
    json: payload
  };
  return new Promise(function (resolve, reject) {
    (0, _request2.default)(opts, function (err, res, body) {
      if (err) {
        console.log(err);
        return reject(err);
      }
      // 200 returned although when occurred error on CCS.
      console.log(body);
      return resolve(body);
    });
  });
};

var packContent = function packContent(content) {
  return {
    objectType: 'iaCloudObject',
    objectKey: 'jp.co.tandd.ondotori.proxy',
    objectDescription: 'temperature data from ondotori',
    timeStamp: (0, _moment2.default)().toISOString(),
    // instanceKey: '',
    ObjectContent: content
  };
};

var storeFormat = function storeFormat(content) {
  return {
    request: 'store',
    serviceID: (0, _uuid.v1)(),
    dataObject: packContent(content)
  };
};

var store = exports.store = function store(objectModel) {
  var payload = storeFormat(objectModel);
  return post(payload);
  // shold be chain promises when json response is returned.
};

var throwNotImplemented = function throwNotImplemented() {
  throw Error('Not implemented yet');
};

var connect = exports.connect = throwNotImplemented;
var retrieve = exports.retrieve = throwNotImplemented;
var getStatus = exports.getStatus = throwNotImplemented;