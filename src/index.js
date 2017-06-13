import express from 'express';
import xmlParser from 'express-xml-bodyparser';
import http from 'http';
import parse from './ondotoriParser';
import { store } from './iaCloud';

const app = express();
app.use(xmlParser());
const server = http.Server(app);

app.post('/', (req, res) => {
  console.log(req.body);
  return parse(req.body)
    .then(model => store(model))
    .then(() => {
      res.status(200).end('ok');
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

server.listen(3000, () => {
  console.log('listening on 3000');
});
