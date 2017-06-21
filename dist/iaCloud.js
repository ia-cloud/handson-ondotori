'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStatus = exports.retrieve = exports.store = exports.connect = undefined;

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _uuid = require('uuid');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var API_URL = process.env.IACLOUD_API_URL;
var USER_ID = process.env.IACLOUD_USER_ID;
var USER_PASSWORD = process.env.IACLOUD_USER_PASS;

var post = function post(payload, url) {
  var opts = {
    url: url || API_URL,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    auth: {
      user: USER_ID,
      password: USER_PASSWORD
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

var connectFormat = function connectFormat(comment) {
  return {
    request: 'connect',
    userID: USER_ID,
    FDSKey: 'jp.co.tandd.ondotori.proxy',
    FDSType: 'iaCloudFDS',
    timeStamp: (0, _moment2.default)().toISOString(),
    comment: comment || null // this value should be null rather than '', undefined or drop-property if has no value.
  };
};

var connect = exports.connect = function connect(url) {
  var payload = connectFormat();
  return post(payload, url).then(function (body) {
    return new Promise(function (resolve, reject) {
      if (body && body.serviceID) {
        return resolve(body.serviceID);
      }
      return reject(body);
    });
  });
};

var packContent = function packContent(content) {
  return {
    objectType: 'iaCloudObjectArray',
    objectKey: content.device.model + ':' + content.device.serial,
    objectDescription: 'temperature data from ondotori',
    timeStamp: (0, _moment2.default)().toISOString(),
    // instanceKey: '',
    length: content.ch.length,
    ObjectArray: content.ch.map(function (ch) {
      return {
        objectType: 'iaCloudObject',
        objectKey: content.device.model + ':' + content.device.serial + '[' + ch.num + ']',
        ObjectContent: {
          contentType: 'iaCloudData',
          contentData: [{ dataName: 'Ch', dataValue: ch.name, unit: null }, { dataName: 'temperature', dataValue: ch.temperature, unit: ch.unit }]
        }
      };
    })
  };
};

var storeFormat = function storeFormat(content, serviceId) {
  return {
    request: 'store',
    serviceID: serviceId || (0, _uuid.v1)(),
    dataObject: packContent(content)
  };
};

var store = exports.store = function store(objectModel, serviceId, url) {
  var payload = storeFormat(objectModel, serviceId);
  return post(payload, url);
  // shold be chain promises when json response is returned.
};

var throwNotImplemented = function throwNotImplemented() {
  throw Error('Not implemented yet');
};

var retrieve = exports.retrieve = throwNotImplemented;
var getStatus = exports.getStatus = throwNotImplemented;