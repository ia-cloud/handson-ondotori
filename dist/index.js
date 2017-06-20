'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressXmlBodyparser = require('express-xml-bodyparser');

var _expressXmlBodyparser2 = _interopRequireDefault(_expressXmlBodyparser);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _ondotoriParser = require('./ondotoriParser');

var _ondotoriParser2 = _interopRequireDefault(_ondotoriParser);

var _iaCloud = require('./iaCloud');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.use((0, _expressXmlBodyparser2.default)());
var server = _http2.default.Server(app);

app.post('/', function (req, res) {
  console.log(req.body);
  return Promise.all([(0, _ondotoriParser2.default)(req.body), (0, _iaCloud.connect)()]).then(function (values) {
    return (0, _iaCloud.store)(values[0], values[1]);
  }).then(function () {
    res.status(200).end('ok');
  }).catch(function (err) {
    res.status(500).json({ error: err });
  });
});

server.listen(3000, function () {
  console.log('listening on 3000');
});