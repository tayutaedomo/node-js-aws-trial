const passport = require('passport');
const LocalStrategy = require('passport-local');
const authSetting = require('./auth.json');
const Users = require('./userDataGetter');

class Authenticator {
  static initialize(app) {
    // passportの初期化
    app.use(passport.initialize());

    // セッション管理をするための設定
    app.use(passport.session());

    // ログイン成功後指定されたオブジェクトをシリアライズして保存する際の
    // シリアライズ処理をフックするもの
    passport.serializeUser((user, done) => {
      return done(null, user);
    });

    passport.deserializeUser((serializedUser, done) => {
      // dynamoDBから指定したユーザIDの情報を取得する
      Users.get(serializedUser.user_id)
        .then(user => {
          // 認証に成功したら以下のものを返す(今回はユーザIDとユーザ名、権限)
          return done(null, {
            user_id: user.user_id,
            user_type: user.user_type,
            user_name: user.user_name
          });
        })
        .catch(() => {
          return done(null, false);
        });
    });
  }

  static setStrategy() {
    // passport.use：ストラテジーの設定
    // ストラテジー：ユーザIDとパスワードを用いた懸賞やOAuthを用いた権限付与、OpenIDを用いた分散認証を実装する
    // localStrategy：ユーザIDとパスワードを用いた認証の実装部分
    passport.use(
      new LocalStrategy(
        {
          usernameField: authSetting.usernameField,
          passwordField: authSetting.passwordField,
          passReqToCallback: true
        },
        (req, userID, password, done) => {
          Users.authorize(userID, password)
            .then(userIdInformation => {
              // 認証に成功したらユーザ情報を返す
              return done(null, userIdInformation);
            })
            .catch(err => {
              // 認証に失敗したらfalseを返し、req.flashを使ってエラーメッセージを表示させる
              req.flash('login_error', err);
              return done(null, false);
            });
        }
      )
    );
  }

  static authenticate(req, res, next) {
    // 認証情報を参照
    passport.authenticate(authSetting.strategyName, {
      // ログインに成功した時のリダイレクト先
      successRedirect: Authenticator.redirect.success,
      // ログインに失敗した時のリダイレクト先と表示メッセージ
      failureRedirect: Authenticator.redirect.failure,
      failureFlash: 'メールアドレスまたはパスワードに誤りがあります'
    })(req, res, next);
  }

  // 認証が完了しているか確認(routes内で使う)
  static isAuthenticated(req, res, next) {
    // 認証が完了している時は次の処理に進む
    if(req.isAuthentocated()) {
      return next();
    } else {
      // 認証が終わっていなかったらログイン画面にリダイレクトする
      return res.redirect(Authenticator.redirect.failure);
    }
  }
}

module.exports = Authenticator;

Authenticator.redirect = {
  success: '/dynamodb/auth',
  failure: '/dynamodb/auth/login',
  permission: '/'
};

