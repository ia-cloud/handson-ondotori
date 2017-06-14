おんどとりプロキシ
===

[![Build Status](https://travis-ci.org/ia-cloud/handson-ondotori.svg?branch=master)](https://travis-ci.org/ia-cloud/handson-ondotori)

[おんどとり](https://www.tandd.co.jp/product/)の測定データを受け取り、ia-cloud形式でCCSへデータを受け渡します

###

### 対応機種
+ --

### 使い方
1. 起動 `npm run start`
1. `http://{host}:3000` でWebサーバが起動する
1. `http://{host}:3000/` へ計測データのXMLをPOST (適切な `Content-Type` を設定してください)
1. ia-cloudのCCSへデータが格納される

### エンドポイント
+ `/` (POST)
  - 計測データの転送

### その他制約事項
+ IAF主催 [IoTハッカソン](https://www.atbridge-cnsltg.com/iot-hackathon) において試験的に使用されます
+ 上記以外の目的での利用はできません