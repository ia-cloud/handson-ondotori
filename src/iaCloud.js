import request from 'request';
import { v1 } from 'uuid';
import moment from 'moment';

const post = (payload) => {
  const opts = {
    url: 'https://a6c9402vn9.execute-api.ap-northeast-1.amazonaws.com/Test3_Stage/test3',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    auth: {
      user: '',
      password: '',
    },
    json: payload,
  };
  return new Promise((resolve, reject) => {
    request(opts, (err, res, body) => {
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

const packContent = content => ({
  objectType: 'iaCloudObject',
  objectKey: 'jp.co.tandd.ondotori.proxy',
  objectDescription: 'temperature data from ondotori',
  timeStamp: moment().toISOString(),
  // instanceKey: '',
  ObjectContent: content,
});

const storeFormat = content => ({
  request: 'store',
  serviceID: v1(),
  dataObject: packContent(content),
});

export const store = (objectModel) => {
  const payload = storeFormat(objectModel);
  return post(payload);
  // shold be chain promises when json response is returned.
};

const throwNotImplemented = () => {
  throw Error('Not implemented yet');
};

export const connect = throwNotImplemented;
export const retrive = throwNotImplemented;
export const getStatus = throwNotImplemented;
