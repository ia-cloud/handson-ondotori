import request from 'request';
import { v1 } from 'uuid';
import moment from 'moment';

const API_URL = process.env.IACLOUD_API_URL;
const USER_ID = process.env.IACLOUD_USER_ID;
const USER_PASSWORD = process.env.IACLOUD_USER_PASS;

const post = (payload, url) => {
  const opts = {
    url: url || API_URL,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    auth: {
      user: USER_ID,
      password: USER_PASSWORD,
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

const connectFormat = comment => ({
  request: 'connect',
  userID: USER_ID,
  FDSKey: 'jp.co.tandd.ondotori.proxy',
  FDSType: 'iaCloudFDS',
  timeStamp: moment().toISOString(),
  comment: comment || null, // this value should be null rather than '', undefined or drop-property if has no value.
});

export const connect = (url) => {
  const payload = connectFormat();
  return post(payload, url)
    .then(body => new Promise((resolve, reject) => {
      if (body && body.serviceID) {
        return resolve(body.serviceID);
      }
      return reject(body);
    }));
};

const packContent = content => ({
  objectType: 'iaCloudObject',
  objectKey: 'maybe.deviceid.or.serialno',
  objectDescription: 'temperature data from ondotori',
  timeStamp: moment().toISOString(),
  // instanceKey: '',
  ObjectContent: content,
});

const storeFormat = (content, serviceId) => ({
  request: 'store',
  serviceID: serviceId || v1(),
  dataObject: packContent(content),
});

export const store = (objectModel, serviceId, url) => {
  const payload = storeFormat(objectModel, serviceId);
  return post(payload, url);
  // shold be chain promises when json response is returned.
};

const throwNotImplemented = () => {
  throw Error('Not implemented yet');
};

export const retrieve = throwNotImplemented;
export const getStatus = throwNotImplemented;

