import moment from 'moment';
import Twitter from 'twitter';

const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN;
const TWITTER_ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET;
const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;

const post = (payload) => {
  const client = new Twitter({
    consumer_key: TWITTER_CONSUMER_KEY,
    consumer_secret: TWITTER_CONSUMER_SECRET,
    access_token_key: TWITTER_ACCESS_TOKEN,
    access_token_secret: TWITTER_ACCESS_TOKEN_SECRET,
  });

  const message = `${moment().format('YYYY-MM-DD HH:mm:ssZ')} 時点の \
${payload.device.model} ${payload.device.serial} の \
${payload.ch[0].name} の温度は \
${payload.ch[0].temperature}[\
${payload.ch[0].unit}] で \
${payload.ch[1].name} の温度は \
${payload.ch[1].temperature}[\
${payload.ch[1].unit}] です。`;

  // Twitterに投稿; statusの値がTwitterに投稿する文章.
  return new Promise(() => client.post('statuses/update', { status: message }));
};

export default payload => post(payload);
