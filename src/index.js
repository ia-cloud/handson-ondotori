import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import * as parser from './ondotoriParser';
import { connect, store } from './iaCloud';

const app = express();
app.use(bodyParser.text({ type: '*/*' }));
const server = http.Server(app);

app.post('/', (req, res) => {
  const reqData = parser.parseRawText(req.body);

  // NTP
  if (reqData.cmd === parser.CMD_REQ_DATETIME) {
    return res.status(200).send(parser.buildMsg(reqData.cmd, parser.buildTimeResponse()));
  }

  // receive data
  if (reqData.cmd === parser.CMD_SEND_DATA) {
    return Promise.all([parser.parseDataXml(reqData.data), connect()])
      .then(values => store(values[0], values[1]))
      .then(() => {
        res.status(200).send(parser.buildMsg(reqData.cmd));
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }

  return res.status(200).send(parser.buildMsg(reqData.cmd, null));
});

server.listen(3000, () => {
  console.log('listening on 3000');
});
