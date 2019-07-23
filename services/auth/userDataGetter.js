const aws = require('aws-sdk');
const bcrypt = require('bcryptjs');
const cryptConfig = require('./crypto.json');
const salt = cryptConfig.salt;
const dynamodb = new aws.DynamoDB.DocumentClient({ region: 'ap-northeast-1' });
const moment = require('moment');
const co = require('co');

class Users {
  constructor() {
    this.KeySchema = [];
    this.notFoundMessage = 'レコードが見つかりませんでした';
  }

  getHashKey(keySchemaObject = this.KeySchema) {
    for (const keySchema of keySchemaObject) {
      if (keySchema.KeyType === Users.Keytypes.HASH) {
        return keySchema.AttributeName;
      }
    }
    return '';
  }

  getRangeKey(keySchemaObject = this.KeySchema) {
    for (const keySchema of keySchemaObject) {
      if (keySchema.KeyType === Users.Keytypes.RANGE) {
        return keySchema.AttributeName;
      }
    }
    return '';
  }
  // 最終ログイン時刻の更新
  updateLastLogin(userId) {
    const key = {
      user_id: userId
    };
    const lastLogin = String(moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ'));
    const item = {
      last_login: lastLogin
    };
    return this.update(key, item);
  }

  update(key, item) {
    const params = {
      TableName: 'app-user',
      Key: key,
      ReturnValues: 'UPDATED_NEW',
      UpdateExpression: 'set #lastLogin = :lastLogin',
      ExpressionAttributeNames: {
        '#lastLogin': 'last_login'
      },
      ExpressionAttributeValues: {
        ':lastLogin': item.last_login
      }
    };
    return new Promise((resolve, reject) => {
      dynamodb.update(params, (err, data) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(data.Attributes);
        }
      });
    });
  }

  get(hashKey, rangeKey = null) {
    const Key = {};
    Key[this.getHashKey()] = hashKey;
    if (rangeKey !== null && this.getRangeKey()) {
      Key[this.getRangeKey()] = rangeKey;
    }
    const params = {
      TableName: 'app-user',
      Key: {
        user_id: hashKey
      }
    };
    return new Promise((resolve, reject) => {
      dynamodb.get(params, (err, data) => {
        if (err) {
          return reject(err);
        } else if (!data.Item) {
          // getの処理はできたけどItemが存在しない = 合致するuser_idがなかったら
          // エラーメッセージを返す
          return reject(this.notFoundMessage);
        } else {
          // 合致するuser_idが存在したらユーザ情報を返す
          return resolve(data.Item);
        }
      });
    });
  }

  authorize(userId, password) {
    return new Promise((resolve, reject) => {
      // coの中でthisを使うと別の場所を見にいくため変数に置く必要がある
      const self = this;
      co(function*() {
        const user = yield self.get(userId);
        // 入力したパスワードをハッシュで暗号化したものとuserテーブルにある暗号化されたパスワードを比較
        // パスワードが一致しなかったら強制的にcatchに移動
        if (user.password !== bcrypt.hashSync(password, salt)) {
          return reject('パスワードが一致しません');
        }
        // パスワードが一致している場合は最終ログイン時刻の更新
        yield self.updateLastLogin(user.user_id);
        const userInfo = {
          user_id: user.user_id,
          user_type: user.user_type
        };
        return userInfo;
      })
        .then(userInfo => {
          return resolve(userInfo);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
}

Users.Keytypes = {
  HASH: 'HASH',
  RANGE: 'RANGE'
};

module.exports = new Users();

