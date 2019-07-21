const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const beautify = require('js-beautify').js_beautify;
const AWS = require('aws-sdk');

const session = require('express-session');
const DynamoDBStore = require('connect-dynamodb')({session: session});

// dynamoose init
const dynamoose = require('dynamoose');
dynamoose.AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1'
});

const routes = require('./routes/index');
const s3_routes = require('./routes/s3');
const cloudfront_routes = require('./routes/cloudfront');
const file_upload_routes = require('./routes/file_upload');
const dynamodb_routes = require('./routes/dynamodb');

const app = express();

// view engine setup
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// session
// Refer: https://qiita.com/DeployCat/items/da9f0ae4444575473787
const DynamoDBStoreOptions = {
  table: 'node-js-aws-trial-sessions',
  //hashKey: "session-id", //ハッシュキー　デフォルトは"id"
  //prefix: "session",    //ハッシュキーに付与するプレフィックス デフォルトは"sess"
  AWSConfigJSON: {
    region: 'us-east-1',
    correctClockSkew: true,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    // httpOptions: {
    //   agent: proxy("http://proxyserver.com:8080"), //プロキシ環境下なら必要
    //   //↓二つはDynamoDBのEPROTOエラー回避のため
    //   secureProtocol: 'TLSv1_method',
    //   ciphers: "ALL"
    // },
  },
  reapInterval: 24 * 60* 60 * 1000 //セッション情報の保持時間
};

app.use(session({
  store: new DynamoDBStore(DynamoDBStoreOptions),
  //name: 'session-name',
  secret: process.env.SESSION_SECRET || 'session-secret-key',
  //resave: false,
  resave: true,
  //saveUninitialized: false,
  saveUninitialized: true,
  cookie: {
    //express-sessionを使っているため、httpOnlyオプションはデフォルトでtrue
    maxAge: 24 * 60* 60 * 1000,
    secure: true
  }
}));


// locals
app.locals.beautify = beautify;

app.use('/s3', s3_routes);
app.use('/cloudfront', cloudfront_routes);
app.use('/file_upload', file_upload_routes);
app.use('/dynamodb', dynamodb_routes);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.error(err.stack || err);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

