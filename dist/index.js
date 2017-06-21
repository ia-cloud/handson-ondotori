'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _ondotoriParser = require('./ondotoriParser');

var parser = _interopRequireWildcard(_ondotoriParser);

var _iaCloud = require('./iaCloud');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.use(_bodyParser2.default.text({ type: '*/*' }));
var server = _http2.default.Server(app);

app.post('/', function (req, res) {
  var reqData = parser.parseRawText(req.body);

  // NTP
  if (reqData.cmd === parser.CMD_REQ_DATETIME) {
    return res.status(200).send(parser.buildMsg(reqData.cmd, parser.buildTimeResponse()));
  }

  // receive data
  if (reqData.cmd === parser.CMD_SEND_DATA) {
    return Promise.all([parser.parseDataXml(reqData.data), (0, _iaCloud.connect)()]).then(function (values) {
      return (0, _iaCloud.store)(values[0], values[1]);
    }).then(function () {
      res.status(200).send(parser.buildMsg(reqData.cmd));
    }).catch(function (err) {
      res.status(500).json({ error: err });
    });
  }

  return res.status(200).send(parser.buildMsg(reqData.cmd, null));
});

server.listen(3000, function () {
  console.log('listening on 3000');
});