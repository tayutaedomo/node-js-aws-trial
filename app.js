var express = require('express');
var engine = require('ejs-mate');
var rollbar = require('rollbar');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var beautify = require('js-beautify').js_beautify;

const routes = require('./routes/index');
const s3_routes = require('./routes/s3');
const cloudfront_routes = require('./routes/cloudfront');
const file_upload_routes = require('./routes/file_upload');

var app = express();

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

// locals
app.locals.beautify = beautify;

app.use('/s3', s3_routes);
app.use('/cloudfront', cloudfront_routes);
app.use('/file_upload', file_upload_routes);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// Use the rollbar error handler to send exceptions to your rollbar account
var rollbar_token = process.env.ROLLBAR_ACCESS_TOKEN;
if (rollbar_token) {
  rollbar.init(rollbar_token, {
    environment: process.env.NODE_ENV
  });
  app.use(rollbar.errorHandler(rollbar_token));
}


module.exports = app;
