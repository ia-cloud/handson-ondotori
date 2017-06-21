import { parseStringSync } from 'xml2js-parser';

export const CMD_REQ_DATETIME = '1';
export const CMD_REQ_SETTING = '2';
export const CMD_SEND_DATA = '3';
export const CMD_SEND_SETTING = '4';
export const CMD_SEND_ALERT = '5';
export const CMD_HAS_ERROR = '0';

export const parseRawText = (text) => {
  const lines = text.split('\r\n');
  const ctrlStr = lines[4];
  const data = lines.slice(5, -2).join('');
  return {
    cmd: /c=(\d)/.exec(ctrlStr)[1],
    data,
  };
};

export const parseDataXml = (xml) => {
  const file = parseStringSync(xml, { explicitArray: false }).file;
  const ch1 = file.group.remote.ch[0];
  const ch2 = file.group.remote.ch[1];
  return Promise.resolve({
    device: {
      serial: file.base.serial,
      model: file.base.model,
      name: file.base.name,
    },
    ch: [
      {
        num: ch1.num,
        name: ch1.name,
        temperature: ch1.current.value._,
        unit: ch1.current.unit,
      },
      {
        num: ch2.num,
        name: ch2.name,
        temperature: ch2.current.value._,
        unit: ch2.current.unit,
      },
    ],
  });
};

export const buildMsg = (cmd, msg) => `R=${cmd},0\r\n${msg}`;

/* eslint no-bitwise: off */
export const buildTimeResponse = (date = new Date()) => {
  const data = [
    0x01,
    0x00,
    0x6F,
    0x00,
    0x06,
    0x00,
    Number(date.getFullYear().toString().substr(-2)),
    date.getMonth() + 1,
    date.getDay(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ];

  const chkSum = data.reduce((acc, val) => acc + val, 0);
  data.push(chkSum | 0x0f);
  data.push(chkSum >>> 8);
  return data.map(d => `00${d.toString(16)}`.slice(-2)).join('');
};
